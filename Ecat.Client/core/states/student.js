System.register(["core/common/mapStrings", "core/states/core"], function(exports_1) {
    var _mp, core_1;
    var StudentStates;
    return {
        setters:[
            function (_mp_1) {
                _mp = _mp_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            StudentStates = (function () {
                function StudentStates() {
                    var _this = this;
                    this.isStudentLoaded = false;
                    this.parentName = 'student';
                    this.loadModule = function ($ocLl) {
                        return _this.isStudentLoaded ? _this.isStudentLoaded :
                            System.import('app/student/student.js')
                                .then(function (studentModClass) {
                                var studMod = studentModClass.default.load();
                                $ocLl.inject(studMod.moduleId);
                                _this.isStudentLoaded = true;
                            });
                    };
                    this.main = {
                        name: core_1.default.mainRefState.name + ".student",
                        parent: core_1.default.mainRefState.name,
                        url: '/student',
                        abstract: true,
                        template: '<div ui-view></div>',
                        data: {
                            authorized: [_mp.EcMapInstituteRole.student]
                        },
                        resolve: {
                            moduleInit: ['$ocLazyLoad', this.loadModule]
                        }
                    };
                    this.assessment = {
                        name: this.main.name + ".assessment",
                        parent: this.main.name,
                        url: '/assessment',
                        templateUrl: 'Client/app/student/features/assessments/assessments.html',
                        controller: 'app.student.assessment as assess',
                        resolve: {
                            moduleLoad: ['moduleInit', function (moduleInit) { return moduleInit; }]
                        }
                    };
                }
                return StudentStates;
            })();
            exports_1("default", StudentStates);
        }
    }
});
