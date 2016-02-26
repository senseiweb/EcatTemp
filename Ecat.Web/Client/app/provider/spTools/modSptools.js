System.register(['angular', 'provider/spTools/sptool'], function(exports_1) {
    var angular, sptool_1;
    var EcProviderSpTools;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
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
                        .service(sptool_1.default.serviceId, sptool_1.default);
                }
                EcProviderSpTools.load = new EcProviderSpTools();
                return EcProviderSpTools;
            })();
            exports_1("default", EcProviderSpTools);
        }
    }
});
