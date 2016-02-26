System.register(["core/states/core", "core/common/mapStrings"], function(exports_1) {
    var core_1, _mp;
    var EcFacultyStates;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_mp_1) {
                _mp = _mp_1;
            }],
        execute: function() {
            EcFacultyStates = (function () {
                function EcFacultyStates() {
                    var _this = this;
                    this.isFacilitatorLoaded = false;
                    this.parentName = 'faculty';
                    this.loadModule = function ($ocLl) {
                        return _this.isFacilitatorLoaded ? _this.isFacilitatorLoaded :
                            System.import('app/faculty/faculty.js').then(function (facClass) {
                                var facMod = facClass.default.load();
                                $ocLl.inject(facMod.moduleId);
                                _this.isFacilitatorLoaded = true;
                            });
                    };
                    this.main = {
                        name: core_1.default.mainRefState.name + ".faculty",
                        parent: core_1.default.mainRefState.name,
                        url: '/faculty',
                        abstract: true,
                        template: '<div ui-view></div>',
                        data: {
                            authorized: [_mp.EcMapInstituteRole.faculty]
                        },
                        resolve: {
                            moduleInit: ['$ocLazyLoad', this.loadModule]
                        }
                    };
                    this.groups = {
                        name: this.main.name + ".groups",
                        parent: this.main.name,
                        url: '/groups',
                        templateUrl: 'Client/app/faculty/features/groups/groups.html',
                        controller: 'app.faculty.features.groups as groups',
                        resolve: {
                            moduleLoad: ['moduleInit', function (moduleInit) { return moduleInit; }]
                        }
                    };
                }
                return EcFacultyStates;
            })();
            exports_1("default", EcFacultyStates);
        }
    }
});
