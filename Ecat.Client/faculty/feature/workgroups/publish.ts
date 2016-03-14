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
        appr: _mp.MpCommentFlag.appr,
        inappr: _mp.MpCommentFlag.inappr
    }
    protected doneWithComments = false;
    protected doneWithStrats = false;
    protected facultyStratResponses: Array<ecat.entity.IFacStratResponse>;
    protected gmWithComments: Array<ecat.entity.ICrseStudInGroup>;
    protected hasComments = true;
    private instructorId: number;
    protected isSaving = false;
    protected isPublishing = false;
    protected pubState = PubState.Loading;
    private routingParams = { crseId: 0, wgId: 0 };
    protected saveBtnText = 'Progress';
    protected selectedAuthor: ecat.entity.ICrseStudInGroup;
    protected selectedRecipient: ecat.entity.ICrseStudInGroup;
    protected selectedComment: ecat.entity.IStudSpComment = null;
    protected workGroupName = 'Not Listed';

    constructor(private $scope: angular.IScope, private c: ICommon, private dCtx: IDataCtx, private sptool: ISpTools) {
        this.routingParams.crseId = c.$stateParams.crseId;
        this.routingParams.wgId = c.$stateParams.wgId;
        this.activate();
    }

    private activate(): void {

        if (!this.routingParams.crseId || !this.routingParams.wgId) {
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
      
        this.dCtx.faculty.activeCourseId = this.routingParams.crseId;
        this.dCtx.faculty.activeGroupId = this.routingParams.wgId;
        this.instructorId = this.dCtx.user.persona.personId;
        this.getActiveWorkGroup();
    }

    //TODO: show confirmation message and then change workgroup back to open
    protected cancelPublish(): void {
        
    }

    protected changeFlag(author: ecat.entity.ICrseStudInGroup | Array<ecat.entity.ICrseStudInGroup>, flag?: string, all?: boolean): void {

        if (!angular.isArray(author)) {
            const singularAuthor = author as ecat.entity.ICrseStudInGroup;
            this.updateAuthorDynamics(singularAuthor);
            if (flag) {
                this.selectedComment.flag.mpFacultyFlag = flag;
            } else {
                singularAuthor.authorOfComments
                    .filter(comment => all || (!!comment.flag && comment.flag.mpFacultyFlag == null))
                    .forEach(comment => {
                        comment.flag.mpFacultyFlag = _mp.MpCommentFlag.appr;
                        comment.flag.flaggedByFacultyId = this.instructorId;
                    });
            };
            this.updateAuthorDynamics(singularAuthor);
            this.checkPublishingReady();
            return null;
        }

        const authors = author as Array<ecat.entity.ICrseStudInGroup>;
        authors.forEach(a => {
            a.authorOfComments
                .filter(comment => all || (!!comment.flag && comment.flag.mpFacultyFlag == null))
                .forEach(comment => {
                    comment.flag.mpFacultyFlag = _mp.MpCommentFlag.appr;
                    comment.flag.flaggedByFacultyId = this.instructorId;
                });
            this.updateAuthorDynamics(a);
        });
        this.checkPublishingReady();
    }

    private checkPublishingReady(): void {
        this.doneWithComments = !this.activeWorkGroup.spComments.some(comment => comment.flag.mpFacultyFlag === null);
        this.doneWithStrats = this.activeWorkGroup.facStratResponses.length !== 0 && this.activeWorkGroup.facStratResponses.every(strat => strat.stratPosition && strat.proposedPosition === null);
    }

    protected evaluateStrat(strat: ecat.entity.IFacStratResponse) {
        this.sptool.evaluateStratification(this.activeWorkGroup, true)
            .then((crseMems) => {
                this.gmWithComments = crseMems;
            });
    }

    private getActiveWorkGroup(): void {
        const that = this;

        //TODO: handle the error handler
        this.dCtx.faculty.fetchActiveWorkGroup()
            .then(getActiveWgResponse)
            .catch(getActiveWgResponseErr);

        function getActiveWgResponse(wg: ecat.entity.IWorkGroup): void {
            that.activeWorkGroup = wg;

            if (wg.mpSpStatus === _mp.MpSpStatus.open) {
                const alertSetting: SweetAlert.Settings = {
                    title: 'Publication Acknowledgement',
                    text: 'Be advised, you are preparing to start publishing this workgroup.\n\n Students will no longer be able to save changes to their assessment. Would you like to continue?',
                    confirmButtonText: 'Start Publication',
                    type: 'info',
                    showCancelButton: true,
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    cancelButtonText: 'Cancel Request',
                    showLoaderOnConfirm: true
                }
                _swal(alertSetting, toPublishOrNotToPublish);
            } else if (wg.mpSpStatus === _mp.MpSpStatus.published) {
                that.c.$state.go(that.c.stateMgr.faculty.wgResult.name, {crseId: that.routingParams.crseId, wgId: that.routingParams.wgId});
            } else {
                that.processActiveWg(wg);
            }
        }

        //TODO: Will throw error if a workgroup is not found, deal with it!
        function getActiveWgResponseErr(reason): void {

        }

        function toPublishOrNotToPublish(response: boolean) {
            if (response) {
                that.activeWorkGroup.mpSpStatus = _mp.MpSpStatus.underReview;
                that.saveChanges()
                    .then(() => that.processActiveWg(that.activeWorkGroup))
                    .then(() => _swal('Publishing Workflow Started...', 'This workgroup is now in review status', 'success'));
            } else {
                _swal.close();
                that.c.$state.go(that.c.stateMgr.faculty.wgList.name);
            }
        }
    }

    protected massAuthorFlagReset(): void {
        const that = this;

        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: `This action will flagged ALL ${this.selectedAuthor.rankName} comments to appropriate. Are you sure?`,
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Reset Author\'s Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {

            if (confirmed) {
                that.changeFlag(that.selectedAuthor, null, true)
                _swal('Update Complete', 'All Author comment have been set to appropriate', 'success');
                this.$scope.$apply();
            }
        });

    }

    protected massAuthorFlagUnflagged(): void {
        const that = this;
        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: `This action will flag ALL ${this.selectedAuthor.rankName} unflagged comments to appropriate. Are you sure?`,
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Flag Author\'s Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {
                that.changeFlag(that.selectedAuthor)
                _swal('Update Complete', 'Author\'s unflagged comments have been flagged', 'success');
                this.$scope.$apply();
            }
        });
    }

    protected massFlagReset(): void {
        const that = this;
        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: 'This action will flag ALL comments to appropriate. Are you sure?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Reset All Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {
                that.changeFlag(this.gmWithComments, null, true);
                _swal('Update Complete', 'All comments have been flagged as appropriate', 'success');
                this.$scope.$apply();
            }
        });
    }

    protected massFlagUnflagged(): void {
        const that = this;
        const alertSettings: SweetAlert.Settings = {
            title: 'Mass Update Pending',
            text: 'This action will flag ALL UNFLAGGED comments to appropriate. Are you sure?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            closeOnCancel: true,
            closeOnConfirm: false,
            confirmButtonText: 'Flag Unflagged Comments'
        };

        _swal(alertSettings, (confirmed?: boolean) => {
            if (confirmed) {
                that.changeFlag(this.gmWithComments);
                _swal('Update Complete', 'All unflagged comments have been flagged as appropriate', 'success');
                this.$scope.$apply();
            }
        });
    }

    protected processActiveWg(wg: ecat.entity.IWorkGroup): void {
        const that = this;
        this.activeWorkGroup = wg;
        const uniques = {} as any;

        this.dCtx.faculty.fetchActiveWgComments()
            .then(procssWgComments)
            .catch(processWgCommentsError);

        function procssWgComments(comments: Array<ecat.entity.IStudSpComment>): void {
            that.hasComments = !!comments;

            if (!that.hasComments) {
                return null;
            }

            that.gmWithComments = comments.map(comment => {
                    if (!uniques.hasOwnProperty(comment.authorPersonId)) {
                        uniques[comment.authorPersonId] = true;
                        return comment.author;
                    }
                })
                .filter(author => !!author)
                .sort(that.sortByLastName);
            that.pubState = PubState.Comment;
            that.saveBtnText = 'Comments';
            that.gmWithComments.forEach((crseStud: ecat.entity.ICrseStudInGroup) => {
                that.updateAuthorDynamics(crseStud);
            });
            that.selectedAuthor = that.gmWithComments[0];
            that.selectComment(that.selectedAuthor.authorOfComments[0]);
            that.checkPublishingReady();
        }
        //TODO: Handle get comment error
        function processWgCommentsError(): void {

        }
    }

    protected publish(): void {
        const that = this;

        if (this.doneWithComments && this.doneWithStrats) {
            const alertSettings: SweetAlert.Settings = {
                title: 'Publish Results',
                text: `This action will publish results of this group to students. Are you sure?`,
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                closeOnCancel: true,
                closeOnConfirm: false,
                confirmButtonText: 'Publish',
                showLoaderOnConfirm: true
        };

            _swal(alertSettings, (confirmed?: boolean) => {
                if (confirmed) {             
                    that.activeWorkGroup.mpSpStatus = _mp.MpSpStatus.published;
                    that.isPublishing = true;
                    //Why is clicking Publish calling save changes?
                    that.saveChanges();
                }

            });
        } else {
            _swal('Not Complete', 'You have unfinished work, you must flag all comments and provide stratification for all members before publishing', _mp.MpSweetAlertType.err);
        }

    }

    protected refreshData(): void {
        
    }

    protected saveChanges(): angular.IPromise<void> {
        const that = this;
        let changedFlags = null;

        if (this.pubState === PubState.Strat && !this.isPublishing) {

            const hasErrors = this.facultyStratResponses.some(response => !response.isValid);

            if (hasErrors) {
                _swal('Not Ready', 'Your proposed stratification changes contain errors, please make ensure all proposed changes are valid before saving', 'warning');
                return null;
            }

            const changeSet = this.facultyStratResponses.filter(response => response.proposedPosition !== null);

            changeSet.forEach(response => response.stratPosition = response.proposedPosition);

            this.isSaving = true;

            return this.dCtx.faculty.saveChanges(changeSet)
                .then(() => {
                    this.facultyStratResponses.forEach((response) => {
                        response.validationErrors = [];
                        response.isValid = true;
                        response.proposedPosition = null;
                    });
                })
                .then(saveChangesResponse)
                .finally(() => { this.isSaving = false });
        }

        if (this.pubState === PubState.Comment && !this.isPublishing) {
             changedFlags = this.activeWorkGroup.spComments.map(comment => {
                if (comment.flag && comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()) {
                    return comment.flag;
                }
            });
        }
     
        this.isSaving = true;

        return this.dCtx.faculty
            .saveChanges(changedFlags)
            .then(saveChangesResponse)
            .catch(saveChangesError)
            .finally(() => {
                this.isSaving = false;
            });


        function saveChangesResponse(): void {
            if (that.isPublishing) {
                _swal('Hello World!', `Publishing WorkGroup ${that.workGroupName} Complete`, _mp.MpSweetAlertType.success);
                that.c.$state.go(that.c.stateMgr.faculty.wgResult.name, { crseId: that.routingParams.crseId, wgId: that.routingParams.wgId });
            }
            that.checkPublishingReady();
        }

        //TODO: if no changes are exists, dCtx will throw an IQueryError that needs to be handled
        function saveChangesError(reason: string|ecat.IQueryError): void {
            if (that.isPublishing) {
                _swal('Oh No!', `Something went wrong attempting to publish WorkGroup ${that.workGroupName}\n\n Please try again`, _mp.MpSweetAlertType.err);
            }
        }
    }

    protected selectAuthor(author: ecat.entity.ICrseStudInGroup): void {
        this.selectedAuthor = author;
        this.selectedComment = author.authorOfComments[0];
        this.updateAuthorDynamics(author);
    }

    protected selectComment(comment: ecat.entity.IStudSpComment): void {
        comment['modDate'] = _moment(comment.modifiedDate).format('DD-MMM-YY: HHMM [hrs]') as any;
        this.selectedComment = comment;
    }

    private sortByLastName(studentA: ecat.entity.ICrseStudInGroup, studentB: ecat.entity.ICrseStudInGroup) {
        if (studentA['name'] < studentB['name']) return -1;
        if (studentA['name'] > studentB['name']) return 1;
        return 0;
    }

    protected switchTo(tab: string): void {
        this.checkPublishingReady();
        if (tab === 'strat') {
            if (!this.facultyStratResponses) {
                this.facultyStratResponses = this.dCtx.faculty.getAllActiveWgFacStrat();
                this.facultyStratResponses.forEach(response => {
                    response.studentAssessee['hasChartData'] = response.studentAssessee
                        .statusOfStudent
                        .breakOutChartData
                        .some(cd => cd.data > 0);
                    this.sptool.evaluateStratification(this.activeWorkGroup, true)
                        .then((crseMembers) => {
                            this.gmWithComments = crseMembers;
                        });
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

    private updateAuthorDynamics(author: ecat.entity.ICrseStudInGroup): void {
        author['isAllCommentFlagged'] = !author.authorOfComments.some(com => com.flag && com.flag.mpFacultyFlag === null);
        author['totalApprCount'] = author.authorOfComments.filter(com => com.flag && com.flag.mpFacultyFlag === _mp.MpCommentFlag.appr).length;
        author['totalInapprCount'] = author.authorOfComments.filter(com => com.flag && com.flag.mpFacultyFlag === _mp.MpCommentFlag.inappr).length;
        author['numRemaining'] = author.authorOfComments.filter(aoc => aoc.flag.mpFacultyFlag === null).length;
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
