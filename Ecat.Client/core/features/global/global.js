System.register(["core/common/commonService", "core/service/data/context"], function(exports_1) {
    var commonService_1, context_1;
    var EcAppCntrl;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            EcAppCntrl = (function () {
                function EcAppCntrl(common, dCtx) {
                    this.common = common;
                    this.dCtx = dCtx;
                    this.mobileBrowserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
                    if (this.mobileBrowserAgents.test(navigator.userAgent)) {
                        angular.element('html').addClass('ismobile');
                    }
                    common.$rootScope.$state = common.$state;
                    common.$rootScope.stateMgr = common.stateMgr;
                    common.$rootScope.startUpComplete = true;
                }
                EcAppCntrl.controllerId = 'app.global';
                EcAppCntrl.$inject = [commonService_1.default.serviceId, context_1.default.serviceId];
                return EcAppCntrl;
            })();
            exports_1("default", EcAppCntrl);
        }
    }
});
