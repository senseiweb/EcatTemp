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

    constructor(private $uim: angular.ui.bootstrap.IModalService, private dCtx: IDataCtx) {
        
    }

    loadSpComment(receiptentId: number): angular.IPromise<void> {
        this.commentModalOptions.resolve = { recipientId: receiptentId };
        return this.$uim.open(this.commentModalOptions).result;
    }
}