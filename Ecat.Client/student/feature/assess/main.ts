import ICommon from "core/common/commonService"
import ISpTools from "provider/spTools/sptool"
import IDataCtx from 'core/service/data/context'
import * as _mp from "core/common/mapStrings"
import _moment from "moment"
import _swal from "sweetalert"

//TODO: Need to add logic if the workgroup status is published to make everything readonly
export default class EcStudentAssessments {
    static controllerId = 'app.student.assessment';
    static $inject = ['$uibModal', ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    //#region Controller Properties
    protected activeCourseId: number;
    protected activeView: number;
    protected activeGroup: ecat.entity.IWorkGroup;
    protected activeSort: { opt: string, desc: boolean } = { opt: 'rankName', desc: false};
    protected assessmentForm: angular.IFormController;
    protected courses: ecat.entity.ICourse[];
    protected commentFlag = _mp.MpCommentFlag;
    protected fullName = 'Unknown';
    protected grpDisplayName = 'Not Set';
    protected hasComment = false;
    protected hasResultComment = false;
    protected isResultPublished = true;
    protected isSaving = false;
    protected isViewOnly = true;
    private log = this.c.getAllLoggers('Assessment Center');
    protected me: ecat.entity.ICrseStudInGroup;
    protected myStrat: ecat.entity.IStratResponse;
    protected peerStrats: Array<ecat.entity.IStratResponse>;
    protected peers: Array<ecat.entity.ICrseStudInGroup>;
    protected radioEffectiveness: string;
    protected radioFreq: string;
    protected resultInventory: Array<ecat.entity.ISpInventory>;
    protected sortOpt = {
        student: 'rankName',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText',
        composite: 'compositeScore'
    }
    protected sortStratOpt = {
        student: 'rankName',
        assess: 'assessText',
        comment: 'commentText',
        strat: 'stratText',
        composite: 'compositeScore'
    }
    protected stratInputVis: boolean;
    protected stratResponses: Array<ecat.entity.IStratResponse>;
    protected stratValComments: Array<ecat.entity.ICrseStudInGroup>;
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
        const that = this;

        //This unwraps the promise and retrieves the objects inside and stores it into a local variable
        //TODO: Whatif there are no courses??
        this.dCtx.student.initCrseStudGroup(false)
            .then(activationResponse)
            .catch(courseError);
       
        function activationResponse(crseStudInGrps: Array<ecat.entity.ICrseStudInGroup>) {
           that.courses = that.getUniqueCourses(crseStudInGrps);
           that.courses.forEach(course => course['displayName'] = `${course.classNumber}: ${course.name}`);
           that.workGroups = that.courses[0]
                .workGroups
                .sort(that.sortWg);

           that.workGroups.forEach(wg => { wg['displayName'] = `${wg.mpCategory}: ${wg.customName || wg.defaultName}` });
           that.activeCourseId = that.dCtx.student.activeCourseId = that.courses[0].id;
           that.activeView = that.workGroups[0].mpSpStatus === _mp.MpSpStatus.published ? StudAssessViews.ResultMyReport : StudAssessViews.PeerList;
           that.setActiveGroup(that.workGroups[0]);
        }

        function courseError(error: any) {
            that.log.warn('There was an error loading Courses', error, true);
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

    private evaluateStrat(): void {
        this.spTools.evaluateStratification(this.activeGroup, false)
            .then((crseMems) => {
                this.stratValComments = crseMems;
            });
    }

    //For when the group is published and is showing the results
    private getWgSpResults(): any {
        const that = this;
        this.dCtx.student
            .getWgSpResult()
            .then(getWgSpResultResponse)
            .catch(getWgSpResultError);

        function getWgSpResultResponse(result: Array<ecat.entity.ISpInventory>): void {
            that.resultInventory = result;
            that.activeView = StudAssessViews.ResultMyReport;
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
                updatedPeer['hasChartData'] = this.me.statusOfPeer[updatedPeer.studentId].breakOutChartData.some(cd => cd.data > 0);
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

    protected saveChanges(): angular.IPromise<void> {
        const that = this;
        const hasErrors = this.stratResponses.some(response => !response.isValid);

        if (hasErrors) {
            _swal('Not ready', 'Your proposed changes contain errors, please ensure all proposed changes are valid before saving', 'warning');
        }

        const changeSet = this.stratResponses.filter(response => response.proposedPosition !== null);

        changeSet.forEach(response => response.stratPosition = response.proposedPosition);

        this.isSaving = true;

        return this.dCtx.student.saveChanges(changeSet)
            .then(() => {
                this.stratResponses.forEach((response) => {
                    response.validationErrors = [];
                    response.isValid = true;
                    response.proposedPosition = null;
                });
            })
            .then(saveChangesResponse)
            .finally(() => { this.isSaving = false });

        function saveChangesResponse(): void {
            that.log.success('Save Stratification, Your changes have been made.', null, true);
        }

    }

    private setActiveCourse(course: ecat.entity.ICourse): void {
        this.activeCourseId = this.dCtx.student.activeCourseId = course.id;
        this.dCtx.student.getActiveCourse()
            .then((crse: ecat.entity.ICourse) => {
                const wrkGrp = crse.workGroups[0];
                this.setActiveGroup(wrkGrp);
            })
            .catch(() => {});
    }

    private setActiveGroup(workGroup: ecat.entity.IWorkGroup): void {
        const that = this;
        this.dCtx.student.activeGroupId = workGroup.id;
        const myId = this.dCtx.user.persona.personId;

        this.grpDisplayName = `${workGroup.mpCategory}: ${workGroup.customName || workGroup.defaultName}`;
        
        //TODO: Need to do something with the error
        this.dCtx.student.getActiveWorkGroup()
            .then(setActiveGroupResponse)
            .catch(setActiveGroupError);

        function setActiveGroupResponse(wg: ecat.entity.IWorkGroup): void {
            const grpMembers = wg.groupMembers;
                            that.activeGroup = wg;

            that.isResultPublished = wg.mpSpStatus === _mp.MpSpStatus.published;
            that.isViewOnly = that.isResultPublished || wg.mpSpStatus !== _mp.MpSpStatus.open;

            if (that.isResultPublished) {
                //TODO: Check how this perform between group changes
                that.log.success('Retrieving results, standby...', null, true);
                that.getWgSpResults();
                console.log();
            }

            if (!grpMembers || grpMembers.length === 0) {
                //TODO: Address a condition if no members are in the group
                return null;
            }

            that.me = grpMembers.filter(gm => gm.studentId === myId)[0];

            grpMembers.forEach(gm => {

                    gm['hasChartData'] = that.me.statusOfPeer[gm.studentId].breakOutChartData.some(cd => cd.data > 0);
                    
                    if (that.isViewOnly) {
                        gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'View' : 'None';
                        gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'View' : 'None';
                        gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
                    } else {
                        gm['assessText'] = (that.me.statusOfPeer[gm.studentId].assessComplete) ? 'Edit' : 'Add';
                        gm['commentText'] = (that.me.statusOfPeer[gm.studentId].hasComment) ? 'Edit' : 'Add';
                        gm['stratText'] = (that.me.statusOfPeer[gm.studentId].stratComplete) ? that.me.statusOfPeer[gm.studentId].stratedPosition : 'None';
                    }
                });
            
                that.peers = grpMembers.filter(gm => gm.studentId !== myId);

                that.stratResponses = that.dCtx.student.getAllStrats();
                that.evaluateStrat();

                that.myStrat = that.stratResponses.filter(strat => strat.assessee.studentId === myId)[0];
                that.peerStrats = that.stratResponses.filter(strat => strat.assessee.studentId !== myId);
        }

        function setActiveGroupError(reason): void {}
    }

    protected sortList(sortOpt: string): void {
        if (this.activeSort.opt === sortOpt) {
            this.activeSort.desc = !this.activeSort.desc;
            return;
        }
  
        this.activeSort.opt = sortOpt;
        this.activeSort.desc = true;
    }

    private sortByLastName(studentA: ecat.entity.ICrseStudInGroup, studentB: ecat.entity.ICrseStudInGroup) {
        if (studentA['name'] < studentB['name']) return -1;
        if (studentA['name'] > studentB['name']) return 1;
        return 0;
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
    Strat,
}

const enum StudAssessViews {
    PeerList,
    StratList,
    ResultMyReport,
    ResultComment
}