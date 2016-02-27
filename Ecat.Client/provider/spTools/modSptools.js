System.register(['angular', 'provider/spTools/commenter', 'provider/spTools/sptool'], function(exports_1) {
    var angular, commenter_1, sptool_1;
    var EcProviderSpTools;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            },
            function (commenter_1_1) {
                commenter_1 = commenter_1_1;
            },
            function (sptool_1_1) {
                sptool_1 = sptool_1_1;
            }],
        execute: function() {
            EcProviderSpTools = (function () {
                function EcProviderSpTools() {
                    this.moduleId = 'app.provider.sptool';
                    angular
                        .module(this.moduleId, ['ui.bootstrap'])
                        .controller(commenter_1.default.controllerId, commenter_1.default)
                        .service(sptool_1.default.serviceId, sptool_1.default);
                }
                EcProviderSpTools.load = new EcProviderSpTools();
                return EcProviderSpTools;
            })();
            exports_1("default", EcProviderSpTools);
        }
    }
});
