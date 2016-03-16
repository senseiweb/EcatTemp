import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _swal from "sweetalert"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudAssess {
    static controllerId = 'app.student.assessment';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    //#region Controller Properties
    protected activeCourseId: number;
    protected activeView: number;
    protected activeGroup: ecat.entity.IWorkGroup;
    protected courses: ecat.entity.ICourse[];
    protected grpDisplayName = 'Not Set';
    protected isResultPublished = false;
    protected isGroupUnderReview = false;
    protected isGroupOpen = false;
    private log = this.c.getAllLoggers('Assessment Center');
    protected routingParams = { crseId: 0, wgId: 0 }
    protected view = {
        peer: StudAssessViews.PeerList,
        strat: StudAssessViews.StratList,
        myReport: StudAssessViews.ResultMyReport,
        comment: StudAssessViews.ResultComment
    }
    protected workGroups: ecat.entity.IWorkGroup[];

    //#endregion

    constructor(private c: ICommon, private dCtx: IDataCtx) {
        if (c.$stateParams.crseId) this.routingParams.crseId = c.$stateParams.crseId;
        if (c.$stateParams.wgId) this.routingParams.wgId = c.$stateParams.wgId;

        this.activate();
    }

    private activate(): void {
        const that = this;

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        //TODO: Whatif there are no courses??
        this.dCtx.student.initCrseStudGroup(false)
            .then(activationResponse)
            .catch(courseError);

        function activationResponse(crseStudInGrps: Array<ecat.entity.ICrseStudInGroup>) {
            that.courses = that.getUniqueCourses(crseStudInGrps);
            that.courses.forEach(course => course['displayName'] = `${course.classNumber}: ${course.name}`);
            let activeCourse: ecat.entity.ICourse;

            if (that.routingParams.crseId) {
                activeCourse = that.courses.filter(crse => crse.id === that.routingParams.crseId)[0];
            } else {
                activeCourse = that.courses[0];
            }

            that.workGroups = activeCourse
                .workGroups
                .sort(that.sortWg);

            that.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });
            that.activeCourseId = that.dCtx.student.activeCourseId = activeCourse.id;

            let activeWorkGroup: ecat.entity.IWorkGroup;

            if (that.routingParams.wgId) {
                activeWorkGroup = that.workGroups.filter(wg => wg.id === that.routingParams.wgId)[0];
            } else {
                activeWorkGroup = that.workGroups[0];
            }

            that.activeView = activeWorkGroup.mpSpStatus === _mp.MpSpStatus.published ? StudAssessViews.ResultMyReport : StudAssessViews.PeerList;
            that.setActiveGroup(activeWorkGroup);
        }

        function courseError(error: any) {
            that.log.warn('There was an error loading Courses', error, true);
        }
    }

    private changeActiveView(view: string) {
        if (this.activeView === StudAssessViews.StratList && view !== 'strat') {
            this.c.broadcast(this.c.coreCfg.coreApp.events.stratStateAbandon, {});
        }
            
        switch (view) {
        case 'assess':
            this.activeView = StudAssessViews.PeerList;
            if (this.c.$state.current.name === this.c.stateMgr.student.assess.name) return null;
            this.c.$state.go(this.c.stateMgr.student.assess.name, { crseId: this.activeGroup.courseId, wgId: this.activeGroup.id });
            break;
        case 'strat':
            this.activeView = StudAssessViews.StratList;
            if (this.c.$state.current.name === this.c.stateMgr.student.assess.name ||
                this.activeGroup.mpSpStatus === _mp.MpSpStatus.published) return null;
            this.c.$state.go(this.c.stateMgr.student.assess.name, { crseId: this.activeGroup.courseId, wgId: this.activeGroup.id });
            break;
        case 'myReport':
            this.activeView = StudAssessViews.ResultMyReport;
            if (this.c.$state.current.name === this.c.stateMgr.student.result.name) return null;
            this.c.$state.go(this.c.stateMgr.student.result.name, { crseId: this.activeGroup.courseId, wgId: this.activeGroup.id });
            break;
        case 'comment':
            this.activeView = StudAssessViews.ResultComment;
            if (this.c.$state.current.name === this.c.stateMgr.student.result.name) return null;
            this.c.$state.go(this.c.stateMgr.student.result.name, { crseId: this.activeGroup.courseId, wgId: this.activeGroup.id });
            break;
        default:
            return null;
        }
    }

    private getUniqueCourses(crseStudInGrp: Array<ecat.entity.ICrseStudInGroup>): Array<ecat.entity.ICourse> {
        const uniqueCourses = {};
        const courses: Array<ecat.entity.ICourse> = [];

        crseStudInGrp.forEach(crseStud => {
            uniqueCourses[crseStud.courseId] = crseStud.course;
        });

        for (let course in uniqueCourses) {
            if (uniqueCourses.hasOwnProperty(course)) {
                courses.push(uniqueCourses[course]);
            }
        }
        courses.forEach((crse: ecat.entity.ICourse) => {
            crse['name'] = crse.classNumber || crse.name;
        });
        return courses.sort((crseA: ecat.entity.ICourse, crseB: ecat.entity.ICourse) => {
            if (crseA.startDate < crseB.startDate) return 1;
            if (crseA.startDate > crseB.startDate) return -1;
            return 0;
        });
    }

    private setActiveCourse(course: ecat.entity.ICourse): void {
        const that = this;
        this.activeCourseId = this.dCtx.student.activeCourseId = course.id;
        this.dCtx.student.getActiveCourse()
            .then(setActiveCourseResponse)
            .catch(() => {});

        function setActiveCourseResponse(crse: ecat.entity.ICourse) {
            const wrkGrp = crse.workGroups[0];
            that.setActiveGroup(wrkGrp);
        }
    }

    private setActiveGroup(workGroup: ecat.entity.IWorkGroup): void {
        const that = this;
        this.dCtx.student.activeGroupId = workGroup.id;

        this.grpDisplayName = `${workGroup.mpCategory}: ${workGroup.customName || workGroup.defaultName}`;

        //TODO: Need to do something with the error
        this.dCtx.student.getActiveWorkGroup()
            .then(setActiveGroupResponse)
            .catch(setActiveGroupError);

        function setActiveGroupResponse(wg: ecat.entity.IWorkGroup): void {
            that.activeGroup = wg;

            that.isGroupOpen = wg.mpSpStatus === _mp.MpSpStatus.open;
            that.isResultPublished = wg.mpSpStatus === _mp.MpSpStatus.published;
            //Enum may be wrong
            that.isGroupUnderReview = wg.mpSpStatus === _mp.MpSpStatus.underReview;

            if (that.isResultPublished) {
                //TODO: Check how this perform between group changes
                that.log.success('Retrieving results, standby...', null, true);
                that.changeActiveView('myReport');
            } else {
                that.changeActiveView('assess');
            }
        }
        function setActiveGroupError(reason): void { }

    }

    private sortWg(wgA: ecat.entity.IWorkGroup, wgB: ecat.entity.IWorkGroup): number {
        if (wgA.mpCategory < wgB.mpCategory) return 1;
        if (wgA.mpCategory > wgB.mpCategory) return -1;
        return 0;
    }



}

const enum StudAssessViews {
    PeerList,
    StratList,
    ResultMyReport,
    ResultComment
}