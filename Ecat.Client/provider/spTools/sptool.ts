import IDataCtx from "core/service/data/context"
import ICommon from "core/common/commonService"
import * as _mpe from "core/common/mapEnum"
import _commenter from "provider/spTools/commenter"
import _assesser from "provider/spTools/assesser"

export default class EcSpTools {
    static serviceId = 'app.service.sptools';
    static $inject = ['$q','$timeout','$uibModal', IDataCtx.serviceId];
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

    constructor(private $q: angular.IQService, private $to: angular.ITimeoutService, private $uim: angular.ui.bootstrap.IModalService,c:ICommon, private dCtx: IDataCtx) {
       
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

    evaluateStratification(workGroup: ecat.entity.IWorkGroup, isInstructor?: boolean): angular.IPromise<Array<ecat.entity.ICrseStudInGroup>> {

        if (this.off) {
            this.$to.cancel(this.off);
        }

        this.off = this.$to((): Array<ecat.entity.ICrseStudInGroup> => {
            const responses: Array<ecat.entity.IFacStratResponse | ecat.entity.IStratResponse> = (isInstructor) ? workGroup.facStratResponses : workGroup.spStratResponses;

            responses.forEach((response: ecat.entity.IFacStratResponse | ecat.entity.IStratResponse, i, array) => {
                response.validationErrors = [];
                if (!response.stratPosition && !response.proposedPosition) {
                    response.validationErrors.push({
                        cat: 'Required',
                        text: 'Without a current strat, a numerical value greater than 0 must be entered in proposed change.'
                    });
                }

                if (response.proposedPosition) {
                    if (!angular.isNumber(response.proposedPosition)) {
                        response.validationErrors.push({
                            cat: 'Invalid Value',
                            text: 'The proposed change should be a number.'
                        });
                    }

                    if (response.proposedPosition > array.length) {
                        response.validationErrors.push({
                            cat: 'Invalid Value',
                            text: 'The proposed change should not be greater than the number of group members.'
                        });
                    }

                    if (response.proposedPosition < 1) {
                        response.validationErrors.push({
                            cat: 'Invalid Value',
                            text: 'The proposed change should be greater than zero.'
                        });
                    }


                    if (isInstructor) {
                        const instrStrat = array as Array<ecat.entity.IFacStratResponse>;
                        instrStrat
                            .filter(r => r.proposedPosition === response.proposedPosition && r.assesseePersonId !== response.assesseePersonId)
                            .forEach(r => {
                                response.validationErrors.push({
                                    cat: 'Duplicate',
                                    text: `${r.studentAssessee.rankName}: has an identical proposed change`
                                });
                            });
                    } else {
                        const studStrat = array as Array<ecat.entity.IStratResponse>;
                        studStrat
                            .filter(r => r.proposedPosition === response.proposedPosition && r.assesseePersonId !== response.assesseePersonId)
                            .forEach(r => {
                                response.validationErrors.push({
                                    cat: 'Duplicate',
                                    text: `${r.assessee.rankName}: has an identical proposed change`
                                });
                            });
                    }


                    if (isInstructor) {
                        const instrStrat = array as Array<ecat.entity.IFacStratResponse>;
                        instrStrat
                            .filter(r => r.stratPosition === response.proposedPosition && r.proposedPosition === null)
                            .forEach(r => {
                                response.validationErrors.push({
                                    cat: 'Duplicate',
                                    text: `${r.studentAssessee.rankName}: is currently at this position without a proposed change.`
                                });
                            });
                    } else {
                        const studStrat = array as Array<ecat.entity.IStratResponse>;
                        studStrat
                            .filter(r => r.stratPosition === response.proposedPosition && r.proposedPosition === null)
                            .forEach(r => {
                                response.validationErrors.push({
                                    cat: 'Duplicate',
                                    text: `${r.assessee.rankName}: is currently at this position without a proposed change.`
                                });
                            });
                    }
                }
                response.isValid = response.validationErrors.length === 0;
            });
            return workGroup.groupMembers;
        }, 1000);
        return this.off;
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   