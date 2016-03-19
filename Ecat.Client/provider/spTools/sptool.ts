import IDataCtx from "core/service/data/context"
import ICommon from "core/common/commonService"
import * as _mpe from "core/common/mapEnum"
import _commenter from "provider/spTools/commenter"
import _assesser from "provider/spTools/assesser"

export default class EcSpTools {
    static serviceId = 'app.service.sptools';
    static $inject = ['$q','$timeout','$uibModal',ICommon.serviceId, IDataCtx.serviceId];
    private off: angular.IPromise<Array<ecat.entity.ICrseStudInGroup>>;
    private commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: _commenter.controllerId,
        controllerAs: 'commenter',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/commenter.html'

    };

    private assssModalOption: angular.ui.bootstrap.IModalSettings = {
        controller: _assesser.controllerId,
        controllerAs: 'assesser',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/assesser.html'

    };

    constructor(private $q: angular.IQService, private $to: angular.ITimeoutService, private $uim: angular.ui.bootstrap.IModalService,c :ICommon, private dCtx: IDataCtx) {
       
    }

    loadSpComment(recipientId: number, viewOnly: boolean): angular.IPromise<void> {
        this.commentModalOptions.resolve = { recipientId: recipientId, viewOnly: viewOnly };
        return this.$uim.open(this.commentModalOptions).result;
    }

    loadSpAssessment(assesseeId: number, viewOnly: boolean): angular.IPromise<void> {
        this.assssModalOption.resolve = {
            assesseeId: assesseeId,
            viewOnly: viewOnly
        }
        return this.$uim.open(this.assssModalOption).result;
    }

    evaluateStratification(workGroup: ecat.entity.IWorkGroup, isInstructor?: boolean, force?: boolean): angular.IPromise<Array<ecat.entity.ICrseStudInGroup>> {
        const that = this;
        if (this.off) {
            this.$to.cancel(this.off);
        }

        function evaluate(): Array<ecat.entity.ICrseStudInGroup> {
            const members = (isInstructor) ? that.dCtx.faculty.getActiveWgMembers() : that.dCtx.student.getActiveWgMembers();
       
            if (members.length > 12) console.log('I have more than 12', members);
                //if (!isInstructor) {
                //    that.dCtx.student.getActiveWorkGroup().then((wg: ecat.entity.IWorkGroup) => {
                //        members = wg.groupMembers;
                //    });
                //} else {
                //}
                members.forEach((member: ecat.entity.ICrseStudInGroup, i, array: Array<ecat.entity.ICrseStudInGroup>) => {
                    member.stratValidationErrors = [];

                    if (!isInstructor) {
                        if (!member.assesseeStratResponse[0] && !member.proposedStratPosition) {
                            member.stratValidationErrors.push({
                                cat: 'Required',
                                text: 'Without a current strat, a numerical value greater than 0 must be entered in proposed change.'
                            });
                        }
                    } else {
                        if ((!member.facultyStrat || !member.facultyStrat.stratPosition) && !member.proposedStratPosition) {
                            member.stratValidationErrors.push({
                                cat: 'Required',
                                text: 'Proposed strat must be greater than 0'
                            });
                        }
                    }

                    if (member.proposedStratPosition) {
                        if (!angular.isNumber(member.proposedStratPosition)) {
                            member.stratValidationErrors.push({
                                cat: 'Invalid Value',
                                text: 'The proposed change should be a number.'
                            });
                        }

                        if (member.proposedStratPosition > array.length) {
                            member.stratValidationErrors.push({
                                cat: 'Invalid Value',
                                text: 'The proposed change should not be greater than the number of group members.'
                            });
                        }

                        if (member.proposedStratPosition < 1) {
                            member.stratValidationErrors.push({
                                cat: 'Invalid Value',
                                text: 'The proposed change should be greater than zero.'
                            });
                        }

                        array
                            .filter(p => p.proposedStratPosition === member.proposedStratPosition && p.studentId !== member.studentId)
                            .forEach(pp => {
                                member.stratValidationErrors.push({
                                    cat: 'Duplicate',
                                    text: `${pp.rankName}: has an identical proposed change`
                                });
                            });

                        if (!isInstructor) {
                            array
                                .filter(p => p.assesseeStratResponse.some(response => response.stratPosition === member.proposedStratPosition &&
                                    response.stratPosition !== null &&
                                    p.proposedStratPosition === null))
                                .forEach(pp => {
                                    member.stratValidationErrors.push({
                                        cat: 'Duplicate',
                                        text: `${pp.rankName}: is currently at this position without a proposed change.`
                                    });
                                });
                        }
                    } else {
                      array
                          .filter(p => p.facultyStrat && p.facultyStrat.stratPosition === member.proposedStratPosition &&
                              p.facultyStrat.stratPosition !== null &&
                              p.proposedStratPosition === null)
                            .forEach(pp => {
                                member.stratValidationErrors.push({
                                    cat: 'Duplicate',
                                    text: `${pp.rankName}: is currently at this position without a proposed change.`
                                });
                            });
                    }
                    member.stratIsValid = member.stratValidationErrors.length === 0;
                });
                return workGroup.groupMembers;
            
        }

        this.off = this.$to(evaluate, 1000);

        return (force) ? this.$q.when(evaluate()) : this.off;
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   