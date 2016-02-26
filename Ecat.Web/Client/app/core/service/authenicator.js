System.register(["core/common/commonService", "core/service/data/context"], function(exports_1) {
    var commonService_1, context_1;
    var EcAuthenicator;
    return {
        setters:[
            function (commonService_1_1) {
                commonService_1 = commonService_1_1;
            },
            function (context_1_1) {
                context_1 = context_1_1;
            }],
        execute: function() {
            EcAuthenicator = (function () {
                function EcAuthenicator($injector) {
                    var _this = this;
                    this.$injector = $injector;
                    this.request = function (rqCfg) {
                        var c = _this.$injector.get(commonService_1.default.serviceId);
                        var dCtx = _this.$injector.get(context_1.default.serviceId);
                        var requestUrl = rqCfg.url.toLowerCase().indexOf('breeze') > -1;
                        if (!requestUrl) {
                            return c.$q.when(rqCfg);
                        }
                        var token = dCtx.user.token;
                        var now = new Date();
                        if (token && token.auth && token.expire > now) {
                            rqCfg.headers.Authorization = "Bearer " + token.auth;
                            return c.$q.when(rqCfg);
                        }
                        return c.$q.when(rqCfg);
                    };
                }
                EcAuthenicator.serviceId = 'data.core.authenicator';
                EcAuthenicator.$inject = ['$injector'];
                return EcAuthenicator;
            })();
            exports_1("default", EcAuthenicator);
        }
    }
});
