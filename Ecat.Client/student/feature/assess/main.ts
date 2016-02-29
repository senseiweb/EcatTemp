import ICommon from "core/common/commonService"
import IDataCtx from 'core/service/data/context'
import ISpTools from "provider/spTools/spTool"
import * as _mp from "core/common/mapStrings"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    //#region Controller Properties
    activeCrseId: number;
    assessmentForm: angular.IFormController;
    courses: ecat.entity.ICourse[];
    fullName = 'Unknown';
    grpDisplayName = 'Not Set';
    hasComment = false;
    isResultPublished = false;
    log = this.c.getAllLoggers('Assessment Center');
    me: ecat.entity.ICrseStudInGroup;
    peers: Array<ecat.entity.ICrseStudInGroup>;
    radioEffectiveness: string;
    radioFreq: string;
    stratInputVis: boolean;
    user: ecat.entity.IPerson;
    workGroups: ecat.entity.IWorkGroup[];
    //#endregion

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx, private spTools: ISpTools) {
        console.log('Assessment Loaded');
        this.activate();
    }

    activate(): void {
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

                //this.courseEnrollments = init;
                //this.activeCourseMember = this.courseEnrollments[0];
                //this.dCtx.student.activeCourseId = this.activeCourseMember.courseId;
                //this.groups = this.activeCourseMember.studGroupEnrollments;
                //this.groups = this.groups.sort(self.sortByCategory);
                //this.activeGroupMember = this.groups[0];
                //self.checkIfPublished();
                //self.isolateSelf();
            })
            .catch(courseError);
       
        this.stratInputVis = false;
    }

    addComment(recipientId: number): void {
        if (!recipientId) {
            console.log('You must pass a recipient id to use this feature');
            return null;
        }
        
        //TODO: Add action after the comment has been dealt with
        this.spTools.loadSpComment(recipientId)
            .then(() => {
                console.log('Comment modal closed');
                this.me.getMigStatus();
            })
            .catch(() => {
                console.log('Comment model errored');
            });
    }

    loadAssessment(assesseeId): void {
        if (!assesseeId) {
            console.log('You must pass a recipient id to use this feature');
            return null;
        }

        //TODO: Add action after the comment has been dealt with
        this.spTools.loadSpAssessment(assesseeId)
            .then(() => {
                console.log('Comment modal closed');
                this.me.getMigStatus();
            })
            .catch(() => {
                console.log('Comment model errored');
            });
    }


    //checkIfPublished(): void {
    //    if (this.activeGroupMember.group.mpSpStatus === _mp.MpSpStatus.published) {
    //        this.isResultPublished = true;
    //    }
    //}

    setActiveCourse(course: ecat.entity.ICourse): void {
        this.activeCrseId = this.dCtx.student.activeCourseId = course.id;
        this.dCtx.student.getActiveCourse()
            .then((crse: ecat.entity.ICourse) => {
                const wrkGrp = crse.workGroups[0];
                this.setActiveGroup(wrkGrp);
            })
            .catch(() => {});
    }

    setActiveGroup(workGroup: ecat.entity.IWorkGroup): void {

        this.dCtx.student.activeGroupId = workGroup.id;
        this.grpDisplayName = `${workGroup.mpCategory} - ${workGroup.defaultName}`;
        const myId = this.dCtx.user.persona.personId;
        
        //TODO: Need to do something with the error
        this.dCtx.student.getActivetWorkGroup()
            .then((wrkGrp: ecat.entity.IWorkGroup) => {
                const grpMembers = wrkGrp.groupMembers;
                if (grpMembers === null || grpMembers.length === 0) {
                    //TODO: Address a condition if no members are in the group
                    return null;
                }
                this.me = grpMembers.filter(gm => gm.studentId === myId)[0];
                this.me.getMigStatus();
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