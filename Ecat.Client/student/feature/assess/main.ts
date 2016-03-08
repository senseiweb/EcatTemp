import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context'
import ISpTools from "provider/spTools/sptool"
import * as _mp from "core/common/mapStrings"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    //#region Controller Properties
    private activeCrseId: number;
    private assessmentForm: angular.IFormController;
    private courses: ecat.entity.ICourse[];
    private commentFlag = _mp.MpCommentFlag;
    private fullName = 'Unknown';
    private grpDisplayName = 'Not Set';
    private hasComment = false;
    private hasResultComment = false;
    private isResultPublished = true;
    private isViewOnly = true;
    private log = this.c.getAllLoggers('Assessment Center');
    private me: ecat.entity.ICrseStudInGroup;
    private peers: Array<ecat.entity.ICrseStudInGroup>;
    private radioEffectiveness: string;
    private radioFreq: string;
    private stratInputVis: boolean;
    private user: ecat.entity.IPerson;
    private workGroups: ecat.entity.IWorkGroup[];
    //#endregion

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx, private spTools: ISpTools) {
        console.log('Assessment Loaded');
        this.activate();
    }

    private activate(): void {
        this.user = this.dCtx.user.persona;
        this.fullName = `${this.user.firstName} ${this.user.lastName}'s`;
        const self = this;

        function courseError(error: any) {
            self.log.warn('There was an error loading Courses', error, true);
        }

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        //TODO: Whatif there are no courses??
        this.dCtx.student.initCrseStudGroup(false)
            .then((crseStudInGrp: ecat.entity.ICrseStudInGroup[]) => {
                this.courses = this.getUniqueCourses(crseStudInGrp);
                this.workGroups = this.courses[0].workGroups;
                this.activeCrseId = this.dCtx.student.activeCourseId = this.courses[0].id;
                this.setActiveGroup(this.workGroups[0]);
            })
            .catch(courseError);
       
        this.stratInputVis = false;
    }

    private addComment(recipientId: number): void {
        if (!recipientId) {
            console.log('You must pass a recipient id to use this feature');
            return null;
        }
        
        //TODO: Add succes or failure logger
        this.spTools.loadSpComment(recipientId, this.isViewOnly)
            .then(() => {
                console.log('Comment modal closed');
            })
            .catch(() => {
                console.log('Comment model errored');
            });
    }

    private getWgSpResults(): void {
        this.dCtx.student
            .getWgSpResult()
            .then(getWgSpResultResponse)
            .catch(getWgSpResultError);

        function getWgSpResultResponse(result: ecat.entity.ISpResult): void {
            
        }

        function getWgSpResultError(reason: ecat.IQueryError): void {
            
        }
    }

    private loadAssessment(assesseeId): void {
        if (!assesseeId) {
            console.log('You must pass a recipient id to use this feature');
            return null;
        }

        //TODO: Add succes or failure logger
        this.spTools.loadSpAssessment(assesseeId, this.isViewOnly)
            .then(() => {
                console.log('Comment modal closed');
            })
            .catch(() => {
                console.log('Comment model errored');
            });
    }

    private setActiveCourse(course: ecat.entity.ICourse): void {
        this.activeCrseId = this.dCtx.student.activeCourseId = course.id;
        this.dCtx.student.getActiveCourse()
            .then((crse: ecat.entity.ICourse) => {
                const wrkGrp = crse.workGroups[0];
                this.setActiveGroup(wrkGrp);
            })
            .catch(() => {});
    }

    private setActiveGroup(workGroup: ecat.entity.IWorkGroup): void {

        this.dCtx.student.activeGroupId = workGroup.id;
        this.grpDisplayName = `${workGroup.mpCategory} - ${workGroup.defaultName}`;
        const myId = this.dCtx.user.persona.personId;
        
        //TODO: Need to do something with the error
        this.dCtx.student.getActiveWorkGroup()
            .then((wrkGrp: ecat.entity.IWorkGroup) => {

                const grpMembers = wrkGrp.groupMembers;

                this.isResultPublished = wrkGrp.mpSpStatus === _mp.MpSpStatus.published;

                this.isViewOnly = this.isResultPublished || wrkGrp.mpSpStatus === _mp.MpSpStatus.arch;

                if (this.isResultPublished) {
                    //TODO: Check how this perform between group changes
                    this.log.info('Retrieving results, standby...', null, true);
                    //this.getWorkGroupResults();
                }

                if (!grpMembers || grpMembers.length === 0) {
                    //TODO: Address a condition if no members are in the group
                    return null;
                }

                this.me = grpMembers.filter(gm => gm.studentId === myId)[0];
                console.log(this.me.statusOfPeer);
                this.peers = grpMembers.filter(gm => gm.studentId !== myId);
            })
            .catch(() => null);
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
        return courses;
    }

    //get viewStrat(): boolean {
    //    return true;
    //}
}