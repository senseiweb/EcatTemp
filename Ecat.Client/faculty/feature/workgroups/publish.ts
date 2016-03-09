import IDataCtx from 'core/service/data/context'
import ICommon from 'core/common/commonService'
import ISpTools from "provider/spTools/sptool"
import _swal from "sweetalert"
import _moment from "moment"
import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"



export default class EcFacultyWgPublish {
    static controllerId = 'app.faculty.wkgrp.publish';
    static $inject = ['$scope',ICommon.serviceId, IDataCtx.serviceId, ISpTools.serviceId];

    protected activeWorkGroup: ecat.entity.IWorkGroup;
    protected commentFlag ={
        neg: _mp.MpCommentFlag.neg,
        neut: _mp.MpCommentFlag.neut,
        pos: _mp.MpCommentFlag.pos
    }
    protected doneWithComments = false;
    protected doneWithStrats = false;
    protected facultyStratResponses: Array<ecat.entity.IFacStratResponse>;
    protected gmWithComments: Array<ecat.entity.ICrseStudInGroup>;
    protected pubState = PubState.Loading;
    protected saveBtnText = 'Progress';
    protected selectedAuthor: ecat.entity.ICrseStudInGroup;
    protected selectedRecipient: ecat.entity.ICrseStudInGroup;
    protected selectedComment: ecat.entity.ISpComment = null;
    protected workGroupName = 'Not Listed';

    constructor(private $scope: angular.IScope, private c: ICommon, private dCtx: IDataCtx, private sptool: ISpTools) {
        
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

    protected authorFlagReset(): void {
        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: `This action will flagged ALL ${this.selectedAuthor.rankName} comments to neutral. Are you sure?`,
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Reset Author\'s Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {

                this.selectedAuthor.authorOfComments.forEach(aoc => {
                    aoc.mpCommentFlagFac = _mp.MpCommentFlag.neut;
                });

                this.selectedAuthor["numRemaining"] = 0;
                swal('Update Complete', 'All Author comment have been set to Netural', 'success');
                this.$scope.$apply();
            }
        });

    }

    protected authorFlagUnflagged(): void {
        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: `This action will flag ALL ${this.selectedAuthor.rankName} unflagged comments to neutral. Are you sure?`,
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Flag Author\'s Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {
                this.selectedAuthor.authorOfComments.forEach(aoc => aoc.mpCommentFlagFac = _mp.MpCommentFlag.neut);
                this.selectedAuthor["numRemaining"] = 0;
                swal('Update Complete', 'Author\'s unflagged comments have been flagged', 'success');
                this.$scope.$apply();
            }
        });
    }

    protected cancelPublish(): void {

    }

    protected evaluateStrat(strat: ecat.entity.IFacStratResponse): void {
       strat = this.sptool.evaluateStratification(strat, this.gmWithComments);
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
                            .then(() => _swal('Publishing...', 'Okay, you are good to go!', 'success'))
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

        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: 'This action will flag ALL comments to neutral. Are you sure?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Reset All Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {
                this.gmWithComments.forEach(gm => {
                    gm.authorOfComments.forEach(aoc => aoc.mpCommentFlagFac = _mp.MpCommentFlag.neut);
                    gm['numRemaining'] = 0;
                });
                
                swal('Update Complete', 'All comments have been flagged as neutral', 'success');
                this.$scope.$apply();
            }
        });

    }

    protected massFlagUnflagged(): void {
        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: 'This action will flag ALL UNFLAGGED comments to neutral. Are you sure?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Flag Unflagged Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {
                this.gmWithComments.forEach(gm => {
                    gm.authorOfComments
                        .filter(aoc => aoc.mpCommentFlagFac === null)
                        .forEach(aoc => aoc.mpCommentFlagFac = _mp.MpCommentFlag.neut);
                    gm['numRemaining'] = 0;
                    
                });
                swal('Update Complete', 'All unflagged comments have been flagged as Neutral', 'success');
                this.$scope.$apply();
            }
        });
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
            _.gmWithComments.forEach((crseStud: ecat.entity.ICrseStudInGroup) => {
                _.updateRemaining(crseStud);
            });
            _.selectedAuthor = _.gmWithComments[0];
            _.selectComment(_.selectedAuthor.authorOfComments[0]);
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
        this.selectedAuthor = author;
        this.selectedComment = author.authorOfComments[0];
        this.updateRemaining(author);
    }

    protected selectComment(comment: ecat.entity.ISpComment): void {
        comment['modDate'] = _moment(comment.modifiedDate).format('DD-MMM-YY: HHMM [hrs]') as any;
        this.selectedComment = comment;
    }

    private sortByLastName(studentA: ecat.entity.ICrseStudInGroup, studentB: ecat.entity.ICrseStudInGroup) {
        if (studentA['name'] < studentB['name']) return -1;
        if (studentA['name'] > studentB['name']) return 1;
        return 0;
    }

    protected switchTo(tab: string): void {
        this.doneWithComments = !this.gmWithComments.some(gm => gm.authorOfComments.some(aoc => aoc.mpCommentFlagFac === null));
        
        if (tab === 'strat') {
            if (!this.facultyStratResponses) {
                this.facultyStratResponses = this.dCtx.faculty.getAllActiveWgFacStrat();
                this.facultyStratResponses.forEach(response => {
                    response.studentAssessee["hasChartData"] = response.studentAssessee
                        .statusOfStudent
                        .breakOutChartData
                        .some(cd => cd.data > 0);
                  this.sptool.evaluateStratification<ecat.entity.IFacStratResponse>(response, this.gmWithComments);
                });
            }
            this.pubState = PubState.Strat;
            this.saveBtnText = 'Stratifications';
        }
        if (tab === 'comment') {
            this.pubState = PubState.Comment;
            this.saveBtnText = 'Comments';
        }
    }

    protected updateRemaining(author: ecat.entity.ICrseStudInGroup, flag?: string): void {
        author['numRemaining'] = author.authorOfComments.filter(aoc => aoc.mpCommentFlagFac === null).length;
        if(flag) {
            this.selectedComment.mpCommentFlagFac = flag;
        }
    }
}

const enum PubState {
    Loading,
    Comment,
    Strat,
    Final
}

interface IStratError {
    cat: string;
    text: string;
}
