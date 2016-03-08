import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import _swal from "sweetalert"
import * as _mp from "core/common/mapStrings"

const enum PubState {
    Loading,
    Comment,
    Strat,
    Final
}

export default class EcFacultyWgPublish {
    static controllerId = 'app.faculty.wkgrp.publish';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    protected activeWorkGroup: ecat.entity.IWorkGroup;
    protected commentFlag ={
        neg: _mp.MpCommentFlag.neg,
        neut: _mp.MpCommentFlag.neut,
        pos: _mp.MpCommentFlag.pos
    }
    protected doneWithComments = false;
    protected doneWithStrats = false;
    protected gmWithComments: Array<ecat.entity.ICrseStudInGroup>;
    protected pubState = PubState.Loading;
    protected selectedAuthor: ecat.entity.ICrseStudInGroup;
    protected selectedRecipient: ecat.entity.ICrseStudInGroup;
    protected selectedComment: ecat.entity.ISpComment = null;
    protected workGroupName = 'Not Listed';

    constructor(private c: ICommon, private dCtx: IDataCtx) {
        
        this.activate(c.$stateParams.crseId, c.$stateParams.wgId);
    }

    private activate(courseId: number, wrkGrpId: number): void {

        if (!courseId || !wrkGrpId) {
            const alertSettings: SweetAlert.Settings = {
                title: 'Missing Parameter',
                text: 'Unable to determine the approprate course and/or workgroup to publish. Please try selecting on from the workgroup list',
                type: 'warning',
                closeOnConfirm: true
            }

            this.c.swal(alertSettings, () => {
                this.c.$state.go(this.c.stateMgr.faculty.wgList.name);
            });
        }
      
        this.dCtx.faculty.activeCourseId = courseId;
        this.dCtx.faculty.activeGroupId = wrkGrpId;
        this.getActiveWorkGroup();
    }

    protected cancelPublish(): void {
        
    }

    private getActiveWorkGroup(): void {
        const _ = this;
        //TODO: handle the error handler
        this.dCtx.faculty.getActiveWorkGroup()
            .then(getActiveWgResponse)
            .catch(getActiveWgResponseErr);

        function getActiveWgResponse(wg: ecat.entity.IWorkGroup): void {
            if (wg.mpSpStatus === _mp.MpSpStatus.open) {

                const alertSetting: SweetAlert.Settings = {
                    title: 'Locking it down',
                    text: 'Be advised, you are preparing to start publishing this workgroup. Students will no longer be able to save changes to their assessment. Would you like to continue?',
                    confirmButtonText: 'Start Publication',
                    type: 'warning',
                    showCancelButton: true,
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    cancelButtonText: 'Cancel Request'
                }

                _swal(alertSetting, (continuePublish: boolean) => {
                    if (continuePublish) {
                        wg.mpSpStatus = _mp.MpSpStatus.underReview;
                        _.saveChanges()
                            .then(() => _swal('Okay, you are good to go!', 'success'))
                            .then(() => _.processActiveWg(wg));
                    } else {
                        _swal.close();
                        _.c.$state.go(_.c.stateMgr.faculty.wgList.name);
                    }
                });
            } else {
                _.processActiveWg(wg);
            }
        }

        //TODO: Will throw error if a workgroup is not found, deal with it!
        function getActiveWgResponseErr(reason): void {

        }
    }

    protected massFlagReset(): void {
        
    }

    protected massFlagUnflagged(): void {
        
    }

    protected processActiveWg(wg: ecat.entity.IWorkGroup): void {
        const _ = this;
        this.activeWorkGroup = wg;
        const uniques = {} as any;

        this.dCtx.faculty.fetchActiveWgComments()
            .then(procssWgComments)
            .catch(processWgCommentsErro);

        function procssWgComments(comments: Array<ecat.entity.ISpComment>): void {
            _.gmWithComments = comments.map(comment => {
                    if (!uniques.hasOwnProperty(comment.authorPersonId)) {
                        uniques[comment.authorPersonId] = true;
                        //This creates a new property on the object, not changed tracked, only view can see it. 
                        comment.author['isAllCommentFlagged'] = !comment.author.authorOfComments.some(com => com.mpCommentFlagFac === null);
                        return comment.author;
                    }
                })
                .filter(author => !!author)
                .sort(_.sortByLastName);
            _.pubState = PubState.Comment;
           _.gmWithComments.forEach(crseStud => {
               _.updateRemaining(crseStud);
            })
            _.selectedAuthor = _.gmWithComments[0];
        }
        //TODO: Handle get comment error
        function processWgCommentsErro(): void {

        }
    }

    protected publish(): void {
        
    }

    protected refreshData(): void {
        
    }

    protected saveChanges(): angular.IPromise<void> {
       return this.dCtx.faculty
            .saveChanges()
            .then(saveChangesResponse)
            .catch(saveChangesError);

        function saveChangesResponse(): void {

        }

        function saveChangesError(): void {

        }
    }

    protected selectAuthor(author: ecat.entity.ICrseStudInGroup): void {
        this.updateRemaining(author);
        this.selectedAuthor = author;
        this.selectedComment = null;
    }

    protected selectComment(comment: ecat.entity.ISpComment): void {
       const activeComment = comment;
       activeComment['isFlaggingComplete'] = comment.mpCommentFlagFac !== null;
       this.selectedComment = comment;
    }

    private sortByLastName(studentA: ecat.entity.ICrseStudInGroup, studentB: ecat.entity.ICrseStudInGroup) {
        if (studentA['name'] < studentB['name']) return -1;
        if (studentA['name'] > studentB['name']) return 1;
        return 0;
    }

    protected switchTo(tab: string): void {
        //TODO: add check if leaving state is finihsed
    }

    protected updateRemaining(author: ecat.entity.ICrseStudInGroup, flag?: string): void {
        author['numRemaining'] = author.authorOfComments.filter(aoc => aoc.mpCommentFlagFac === null).length;
        if(flag) {
            this.selectedComment.mpCommentFlagFac = flag;
        }
    }
}