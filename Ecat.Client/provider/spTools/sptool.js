System.register(["core/service/data/context", "provider/spTools/commenter"], function(exports_1) {
    var context_1, commenter_1;
    var EcSpTools;
    return {
        setters:[
            function (context_1_1) {
                context_1 = context_1_1;
            },
            function (commenter_1_1) {
                commenter_1 = commenter_1_1;
            }],
        execute: function() {
            EcSpTools = (function () {
                function EcSpTools($uim, dCtx) {
                    this.$uim = $uim;
                    this.dCtx = dCtx;
                    this.commentModalOptions = {
                        controller: commenter_1.default.controllerId,
                        controllerAs: 'commenter',
                        bindToController: true,
                        keyboard: false,
                        backdrop: 'static',
                        templateUrl: '@[appProvider]/spTools/commenter.html'
                    };
                }
                EcSpTools.prototype.loadSpComment = function (recipientId) {
                    this.commentModalOptions.resolve = { recipientId: recipientId };
                    return this.$uim.open(this.commentModalOptions).result;
                };
                EcSpTools.serviceId = 'app.service.sptools';
                EcSpTools.$inject = ['$uibModal', context_1.default.serviceId];
                return EcSpTools;
            })();
            exports_1("default", EcSpTools);
        }
    }
});
