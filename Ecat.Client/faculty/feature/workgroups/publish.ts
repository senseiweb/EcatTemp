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
    protected hasComments = true;
    private instructorId: number;
    protected isSaving = false;
    protected isPublishing = false;
    protected pubState = PubState.Loading;
    protected saveBtnText = 'Progress';
    protected selectedAuthor: ecat.entity.ICrseStudInGroup;
    protected selectedRecipient: ecat.entity.ICrseStudInGroup;
    protected selectedComment: ecat.entity.IStudSpComment = null;
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
        this.instructorId = this.dCtx.user.persona.personId;
        this.getActiveWorkGroup();
    }

    protected authorFlagReset(): void {
        const _ = this;

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
                    aoc.flag.mpFacultyFlag = _mp.MpCommentFlag.neut;
                    aoc.flag.flaggedByFacultyId = _.instructorId;
                });

                this.selectedAuthor["numRemaining"] = 0;
                swal('Update Complete', 'All Author comment have been set to Netural', 'success');
                this.$scope.$apply();
            }
        });

    }

    protected authorFlagUnflagged(): void {
        const _ = this;
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
                this.selectedAuthor.authorOfComments.forEach(aoc => {
                    aoc.flag.mpFacultyFlag = _mp.MpCommentFlag.neut;
                    aoc.flag.flaggedByFacultyId = _.instructorId;
                });
                this.selectedAuthor["numRemaining"] = 0;
                swal('Update Complete', 'Author\'s unflagged comments have been flagged', 'success');
                this.$scope.$apply();
            }
        });
    }

    protected cancelPublish(): void {

    }

    protected evaluateStrat(strat: ecat.entity.IFacStratResponse) {
        this.sptool.evaluateStratification(this.activeWorkGroup, true)
            .then((crseMems) => {
                this.gmWithComments = crseMems;
            });
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
                    text: 'Be advised, you are preparing to start publishing this workgroup.\n\n Students will no longer be able to save changes to their assessment. Would you like to continue?',
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
                            .then(() => {_swal('Publishing Workflow Started...', 'This workgroup is now in review status', 'success')})
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
        const _ = this;
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
                    gm.authorOfComments.forEach(aoc => {
                        aoc.flag.mpFacultyFlag = _mp.MpCommentFlag.neut;
                        aoc.flag.flaggedByFacultyId = _.instructorId;
                    });
                    gm['numRemaining'] = 0;
                });
                
                swal('Update Complete', 'All comments have been flagged as neutral', 'success');
                this.$scope.$apply();
            }
        });

    }

    protected massFlagUnflagged(): void {
        const _ = this;
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
                        .filter(aoc => aoc.flag.mpFacultyFlag === null)
                        .forEach(aoc => {
                            aoc.flag.mpFacultyFlag = _mp.MpCommentFlag.neut;
                            aoc.flag.flaggedByFacultyId = _.instructorId;
                        });
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

        function procssWgComments(comments: Array<ecat.entity.IStudSpComment>): void {
            _.hasComments = !!comments;

            if (!_.hasComments) {
                return null;
            }

            _.gmWithComments = comments.map(comment => {
                    if (!uniques.hasOwnProperty(comment.authorPersonId)) {
                        uniques[comment.authorPersonId] = true;
                        //This creates a new property on the object, not changed tracked, only view can see it. 

                        comment.author['isAllCommentFlagged'] = !comment.author.authorOfComments.some(com =>com.flag && com.flag.mpFacultyFlag === null);
                        comment.author['totalNegCount'] = comment.author.authorOfComments.filter(com => com.flag && com.flag.mpFacultyFlag === _mp.MpCommentFlag.neg).length;
                        comment.author['totalPosCount'] = comment.author.authorOfComments.filter(com => com.flag && com.flag.mpFacultyFlag === _mp.MpCommentFlag.pos).length;
                        comment.author['totalNeutCount'] = comment.author.authorOfComments.filter(com => com.flag && com.flag.mpFacultyFlag === _mp.MpCommentFlag.neut).length;

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
            _.doneWithComments = !_.activeWorkGroup.spComments.some(comment => comment.flag.mpFacultyFlag === null);
            _.doneWithStrats = !_.activeWorkGroup.facStratResponses.some(strat => strat.stratPosition === null || strat.proposedPosition !== null); 
        }
        //TODO: Handle get comment error
        function processWgCommentsErro(): void {

        }
    }

    protected publish(): void {
        const _ = this;

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
                    _.activeWorkGroup.mpSpStatus = _mp.MpSpStatus.published;
                    _.isPublishing = true;
                    //Why is clicking Publish calling save changes?
                    _.saveChanges();
                }

            });
        } else {
            swal('Not Complete', 'You have unfinished work, you must flag all comments and provide stratification for all members before publishing', 'error');
        }

    }

    protected refreshData(): void {
        
    }

    protected saveChanges(): angular.IPromise<void> {
        const _ = this;

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
                .then(saveChangesResponse)
                .then(() => {
                    this.facultyStratResponses.forEach((response) => {
                        response.validationErrors = [];
                        response.isValid = true;
                        response.proposedPosition = null;
                    });
                })
                .finally(() => { this.isSaving = false });
        }

        const changedFlags = this.activeWorkGroup.spComments.map(comment => {
            if (comment.flag && comment.flag.entityAspect.entityState.isAddedModifiedOrDeleted()) {
                return comment.flag;
            }
        });

        this.isSaving = true;

        return this.dCtx.faculty
            .saveChanges(changedFlags)
            .then(saveChangesResponse)
            .catch(saveChangesError)
            .finally(() => {
                this.isSaving = false;
            });
                  

        function saveChangesResponse(): void {
            _.doneWithComments = !_.activeWorkGroup.spComments.some(comment => comment.flag.mpFacultyFlag === null);
            _.doneWithStrats = !_.activeWorkGroup.facStratResponses.some(strat => strat.stratPosition === null || strat.proposedPosition !== null); 
                if (_.isPublishing) {
                    swal('Hello World!', `Publishing WorkGroup ${_.workGroupName} Complete`, 'success');
                }
            }

        //TODO: if no changes are exists, dCtx will throw an IQueryError that needs to be handled
        function saveChangesError(reason: string|ecat.IQueryError): void {
            if (_.isPublishing) {
                swal('Oh No!', `Something went wrong attempting to publish WorkGroup ${_.workGroupName}\n\n Please try again`, 'error');
            }
        }
    }

    protected selectAuthor(author: ecat.entity.ICrseStudInGroup): void {
        this.selectedAuthor = author;
        this.selectedComment = author.authorOfComments[0];
        this.updateRemaining(author);
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
        this.doneWithComments = !this.activeWorkGroup.spComments.some(comment => comment.flag.mpFacultyFlag === null);
        this.doneWithStrats = !this.activeWorkGroup.facStratResponses.some(strat => strat.stratPosition === null || strat.proposedPosition !== null);

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

    protected updateRemaining(author: ecat.entity.ICrseStudInGroup, flag?: string): void {
        author['numRemaining'] = author.authorOfComments.filter(aoc => aoc.flag.mpFacultyFlag === null).length;
        if(flag) {
            this.selectedComment.flag.mpFacultyFlag = flag;
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
