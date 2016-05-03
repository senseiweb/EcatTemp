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
    protected activeGroup: ecat.entity.IWorkGroup;
    protected courses: ecat.entity.ICourse[];
    protected grpDisplayName = 'Not Set';
    private log = this.c.getAllLoggers('Assessment Center');
    protected routingParams = { crseId: 0, wgId: 0 }
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
        this.dCtx.student.initStudentCourses()
            .then(activationResponse)
            .catch(courseError);

        function activationResponse(courses: Array<ecat.entity.ICourse>) {

            courses.sort((crseA: ecat.entity.ICourse, crseB: ecat.entity.ICourse) => {
                if (crseA.startDate < crseB.startDate) return 1;
                if (crseA.startDate > crseB.startDate) return -1;
                return 0;
            });

             courses.forEach(course => course['displayName'] = `${course.classNumber}: ${course.name}`);

            let activeCourse: ecat.entity.ICourse;

            if (that.routingParams.crseId) {
                activeCourse = courses.filter(crse => crse.id === that.routingParams.crseId)[0];
            } else {
                activeCourse = courses[0];
            }

            that.workGroups = activeCourse
                .workGroups
                .sort(that.sortWg);

            that.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });

            that.activeCourseId = that.dCtx.student.activeCourseId = activeCourse.id;

            let activeWorkGroup: ecat.entity.IWorkGroup;

            if (that.routingParams.wgId) {
                activeWorkGroup = that.workGroups.filter(wg => wg.workGroupId === that.routingParams.wgId)[0];
                if (!activeWorkGroup) activeWorkGroup = that.workGroups[0];
            } else {
                activeWorkGroup = that.workGroups[0];
            }

            that.courses = courses;
            that.setActiveGroup(activeWorkGroup);
        }

        function courseError(error: any) {
            if (that.courses.length > 0 && that.courses[0].workGroups.length === 0) {
                that.grpDisplayName = 'None';
                that.log.warn('No group enrollments for this course', error, true);
            } else {
                that.log.warn('There was an error loading Courses', error, true);
            }
        }
    }

    private setActiveCourse(course: ecat.entity.ICourse): void {
        const that = this;
        this.activeCourseId = this.dCtx.student.activeCourseId = course.id;
        this.dCtx.student.fetchActiveCourse()
            .then(setActiveCourseResponse)
            .catch(() => {});

        function setActiveCourseResponse(crse: ecat.entity.ICourse) {
            that.workGroups = crse.workGroups;
            that.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });
            const wrkGrp = crse.workGroups[0];
            if (wrkGrp !== undefined) {
                that.setActiveGroup(wrkGrp);
            } else {
                that.grpDisplayName = 'None';
                const params = { crseId: that.activeCourseId, wgId: 0 };
                that.c.$state.go(that.c.stateMgr.student.assessment.name, params);
            }
        }
    }

    private setActiveGroup(workGroup: ecat.entity.IWorkGroup): void {
        this.dCtx.student.activeGroupId = workGroup.workGroupId;
        this.grpDisplayName = `${workGroup.mpCategory}: ${workGroup.customName || workGroup.defaultName}`;
        this.activeGroup = workGroup;
        const viewOnly = workGroup.mpSpStatus !== _mp.MpSpStatus.open;
        const wId = (workGroup) ? workGroup.workGroupId : 0;
        const params = { crseId: this.activeCourseId, wgId: wId }
        viewOnly ? this.c.$state.go(this.c.stateMgr.student.result.name, params) : this.c.$state.go(this.c.stateMgr.student.assess.name, params);
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