import IDataCtx from "core/service/data/context"
import _commenter from "provider/spTools/commenter"
import _assesser from "provider/spTools/assesser"

export default class EcSpTools {
    static serviceId = 'app.service.sptools';
    static $inject = ['$uibModal', IDataCtx.serviceId];

    private commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: _commenter.controllerId,
        controllerAs: 'commenter',
        bindToController: true,
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/commenter.html'

    };

    private assssModalOption: angular.ui.bootstrap.IModalSettings = {
        controller: _assesser.controllerId,
        controllerAs: 'assesser',
        size: 'lg',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/assesser.html'

    };

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx) {
        
    }

    loadSpComment(recipientId: number, viewOnly: boolean): angular.IPromise<void> {
        this.commentModalOptions.resolve = { recipientId: recipientId, viewOnly: viewOnly };
        return this.$uim.open(this.commentModalOptions).result;
    }

    loadSpAssessment(assesseeId: number, viewOnly: boolean): angular.IPromise<void> {
        this.assssModalOption.resolve = {
            assesseeId: assesseeId, viewOnly: viewOnly
    }
        return this.$uim.open(this.assssModalOption).result;
    }
}