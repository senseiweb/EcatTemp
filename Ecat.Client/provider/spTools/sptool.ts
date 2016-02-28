import IDataCtx from "core/service/data/context"
import _commenter from "provider/spTools/commenter"

export default class EcSpTools {
    static serviceId = 'app.service.sptools';
    static $inject = ['$uibModal', IDataCtx.serviceId];

    private commentModalOptions: angular.ui.bootstrap.IModalSettings = {
        controller: _commenter.controllerId,
        controllerAs: 'commenter',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/commenter.html'

    };

    private assssModalOption: angular.ui.bootstrap.IModalSettings = {
        controller: _commenter.controllerId,
        controllerAs: 'assesser',
        bindToController: true,
        keyboard: false,
        backdrop: 'static',
        templateUrl: '@[appProvider]/spTools/assesser.html'

    };

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx) {
        
    }

    loadSpComment(recipientId: number): angular.IPromise<void> {
        this.commentModalOptions.resolve = { recipientId: recipientId };
        return this.$uim.open(this.commentModalOptions).result;
    }

    loadSpAssessment(recipientId: number): angular.IPromise<void> {
        this.assssModalOption.resolve = { recipientId: recipientId }
        return this.$uim.open(this.assssModalOption).result;
    }
}