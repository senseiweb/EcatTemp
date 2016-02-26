System.register(["core/states/core", "core/states/student", "core/states/faculty", "core/config/cfgProviders"], function(exports_1) {
    var core_1, student_1, faculty_1, cfgProviders_1;
    var EcStateConfiguration;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (student_1_1) {
                student_1 = student_1_1;
            },
            function (faculty_1_1) {
                faculty_1 = faculty_1_1;
            },
            function (cfgProviders_1_1) {
                cfgProviders_1 = cfgProviders_1_1;
            }],
        execute: function() {
            EcStateConfiguration = (function () {
                function EcStateConfiguration($lp, $sp, $up, sm, userStatic) {
                    var _this = this;
                    this.$sp = $sp;
                    this.sm = sm;
                    this.statesToConfigure = [core_1.default, student_1.default, faculty_1.default];
                    this.load = function () { return _this.statesToConfigure.forEach(function (appStateClass) {
                        var parentName = '';
                        var stateClass = new appStateClass();
                        var stateNames = Object.keys(stateClass);
                        stateNames.forEach(function (stateName) {
                            var stateToLoad = stateClass[stateName];
                            if (angular.isObject(stateToLoad)) {
                                _this.$sp.state(stateToLoad);
                                if (parentName) {
                                    _this.sm[parentName][stateName] = stateToLoad;
                                }
                                else {
                                    parentName = stateClass.parentName;
                                    _this.sm[parentName] = {};
                                    _this.sm[parentName][stateName] = stateToLoad;
                                }
                            }
                        });
                    }); };
                    $lp.html5Mode(true);
                    $up.otherwise(function () {
                        var self = _this;
                        var urlRoute = '';
                        var regEx = /\.(\w+)$/;
                        function calculateUrl(state) {
                            if (!state) {
                                return urlRoute;
                            }
                            urlRoute = state.url + urlRoute;
                            var parentNameHasDot = regEx.exec(state.parent);
                            var parentPropName;
                            if (parentNameHasDot) {
                                parentPropName = parentNameHasDot[1];
                            }
                            else {
                                parentPropName = state.parent;
                            }
                            calculateUrl(self.sm.core[parentPropName]);
                        }
                        if (userStatic === null) {
                            calculateUrl(_this.sm.core.login);
                            return urlRoute;
                        }
                        if (userStatic.person.registrationComplete) {
                            calculateUrl(_this.sm.core.dashboard);
                            return urlRoute;
                        }
                        if (!userStatic.person.registrationComplete) {
                            calculateUrl(_this.sm.core.profile);
                            return urlRoute;
                        }
                        calculateUrl(_this.sm.core.dashboard);
                        return urlRoute;
                    });
                    this.load();
                }
                EcStateConfiguration.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', (cfgProviders_1.default.stateConfigProvider.id + "Provider"), 'userStatic'];
                return EcStateConfiguration;
            })();
            exports_1("default", EcStateConfiguration);
        }
    }
});
