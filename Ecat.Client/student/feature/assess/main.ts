import ICommon from "core/common/commonService"
import ISpTools from "provider/spTools/sptool"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _moment from "moment"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    //#region Controller Properties
    protected activeCrseId: number;
    protected activeView: number;
    protected activeSort: { opt: string, desc: boolean } = { opt: 'rankName', desc: false}
    protected assessmentForm: angular.IFormController;
    protected courses: ecat.entity.ICourse[];
    protected commentFlag = _mp.MpCommentFlag;
    protected fullName = 'Unknown';
    protected grpDisplayName = 'Not Set';
    protected hasComment = false;
    protected hasResultComment = false;
    protected isResultPublished = true;
    protected isViewOnly = true;
    private log = this.c.getAllLoggers('Assessment Center');
    protected me: ecat.entity.ICrseStudInGroup;
    protected peers: Array<ecat.entity.ICrseStudInGroup>;
    protected radioEffectiveness: string;
    protected radioFreq: string;
    protected sortOpt = {
        student: 'rankName',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText'
    }
    protected stratInputVis: boolean;
    protected user: ecat.entity.IPerson;
    protected view = {
        peer: StudAssessViews.PeerList,
        strat: StudAssessViews.StratList,
        myReport: StudAssessViews.ResultMyReport,
        comment: StudAssessViews.ResultComment
    }
    protected workGroups: ecat.entity.IWorkGroup[];
    //#endregion

    constructor(private uiModal: angular.ui.bootstrap.IModalService, private c: ICommon, private dCtx: IDataCtx, private spTools: ISpTools) {
        console.log('Assessment Loaded');
        this.activate();
    }

    private activate(): void {
        this.user = this.dCtx.user.persona;
        const _ = this;

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        //TODO: Whatif there are no courses??
        this.dCtx.student.initCrseStudGroup(false)
            .then(activationResponse)
            .catch(courseError);
       
        function activationResponse(crseStudInGrps: Array<ecat.entity.ICrseStudInGroup>) {
            _.courses = _.getUniqueCourses(crseStudInGrps);
            _.workGroups = _.courses[0]
                .workGroups
                .sort(_.sortWg);

            _.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });
            _.activeCrseId = _.dCtx.student.activeCourseId = _.courses[0].id;
            _.activeView = _.workGroups[0].mpSpStatus === _mp.MpSpStatus.published ? StudAssessViews.ResultMyReport : StudAssessViews.PeerList;
            _.setActiveGroup(_.workGroups[0]);
        }

        function courseError(error: any) {
            _.log.warn('There was an error loading Courses', error, true);
        }
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

    protected loadAssessment(assesseeId): void {
        if (!assesseeId) {
            console.log('You must pass a recipient id to use this feature');
            return null;
        }

        //TODO: Add succes or failure logger
        this.spTools.loadSpAssessment(assesseeId, this.isViewOnly)
            .then(() => {
                console.log('Comment modal closed');
                if (this.isViewOnly) {
                    return;
                }
                const updatedPeer = this.peers.filter(peer => peer.studentId === assesseeId)[0];
                this.me.updateStatusOfPeer();
                updatedPeer['assessText'] = this.me.statusOfPeer[updatedPeer.studentId].assessComplete ? 'Edit' : 'Add';
            })
            
            .catch(() => {
                console.log('Comment model errored');
            });
    }

    protected loadComment(recipientId): void {
        if (!recipientId) {
            console.log('You must pass a recipient id to use this feature');
            return null;
        }

        //TODO: Add succes or failure logger
        this.spTools.loadSpComment(recipientId, this.isViewOnly)
            .then(() => {
                console.log('Comment modal closed');
                if (this.isViewOnly) {
                    return;
                }
                const updatedPeer = this.peers.filter(peer => peer.studentId === recipientId)[0];
                this.me.updateStatusOfPeer();
                updatedPeer['commentText'] = this.me.statusOfPeer[updatedPeer.studentId].hasComment ? 'Edit' : 'Add';
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
        const myId = this.dCtx.user.persona.personId;
        
        //TODO: Need to do something with the error
        this.dCtx.student.getActiveWorkGroup()
            .then((wrkGrp: ecat.entity.IWorkGroup) => {

                const grpMembers = wrkGrp.groupMembers;

                this.isResultPublished = wrkGrp.mpSpStatus === _mp.MpSpStatus.published;

                this.isViewOnly = this.isResultPublished || wrkGrp.mpSpStatus !== _mp.MpSpStatus.open;

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

                grpMembers.forEach(gm => {
                    if (this.isViewOnly) {
                        gm['assessText'] = (this.me.statusOfPeer[gm.studentId].assessComplete) ? 'View' : 'None';
                        gm['commentText'] = (this.me.statusOfPeer[gm.studentId].hasComment) ? 'View' : 'None';
                        gm['stratText'] = (this.me.statusOfPeer[gm.studentId].stratComplete) ? this.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
                    } else {
                        gm['assessText'] = (this.me.statusOfPeer[gm.studentId].assessComplete) ? 'Edit' : 'Add';
                        gm['commentText'] = (this.me.statusOfPeer[gm.studentId].hasComment) ? 'Edit' : 'Add';
                        gm['stratText'] = (this.me.statusOfPeer[gm.studentId].stratComplete) ? this.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
                    }
                });
                this.peers = grpMembers.filter(gm => gm.studentId !== myId);
               
            })
            .catch(() => null);
    }

    protected sortList(sortOpt: string): void {
        if (this.activeSort.opt === sortOpt) {
            this.activeSort.desc = !this.activeSort.desc;
            return;
        }
  
        this.activeSort.opt = sortOpt;
        this.activeSort.desc = true;
    }

    private sortWg(wgA: ecat.entity.IWorkGroup, wgB: ecat.entity.IWorkGroup): number {
        if (wgA.mpCategory < wgB.mpCategory) return 1;
        if (wgA.mpCategory > wgB.mpCategory) return -1;
       return 0;
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
}

const enum SortOpt {
    Student,
    Assess,
    Comment,
    Strat
}

const enum StudAssessViews {
    PeerList,
    StratList,
    ResultMyReport,
    ResultComment
}