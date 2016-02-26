System.register([], function(exports_1) {
    var EcCfgProviders;
    return {
        setters:[],
        execute: function() {
            EcCfgProviders = (function () {
                function EcCfgProviders() {
                }
                EcCfgProviders.appCfgProvider = {
                    id: 'appCfg',
                    provider: function () {
                        var appCfgs = {
                            coreApp: null,
                            $get: function () { return appCfgs; }
                        };
                        return appCfgs;
                    }
                };
                EcCfgProviders.stateConfigProvider = {
                    id: 'stateMgr',
                    provider: function () {
                        var stateMgrProvider = {
                            core: null,
                            student: null,
                            faculty: null,
                            $get: function () { return stateMgrProvider; }
                        };
                        return stateMgrProvider;
                    }
                };
                return EcCfgProviders;
            })();
            exports_1("default", EcCfgProviders);
        }
    }
});
