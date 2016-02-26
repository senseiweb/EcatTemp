System.register([], function(exports_1) {
    var EcToggleSideBar;
    return {
        setters:[],
        execute: function() {
            EcToggleSideBar = (function () {
                function EcToggleSideBar() {
                    this.restrict = 'A';
                    this.scope = {
                        modelLeft: '=',
                        modelRight: '='
                    };
                    this.link = function (scope, element, attr) {
                        element.on('click', function () {
                            if (element.data('target') === 'mainmenu') {
                                if (scope.modelLeft === false) {
                                    scope.$apply(function () { scope.modelLeft = true; });
                                }
                                else {
                                    scope.$apply(function () { scope.modelLeft = false; });
                                }
                            }
                            //    if (element.data('target') === 'chat') {
                            //        if (scope.modelRight === false) {
                            //            scope.$apply(() => { scope.modelRight = false; });
                            //        }
                            //    } else {
                            //        scope.$apply(() => { scope.modelRight = false; });
                            //    }
                        });
                    };
                }
                EcToggleSideBar.directiveId = 'toggleSidebar';
                return EcToggleSideBar;
            })();
            exports_1("default", EcToggleSideBar);
        }
    }
});
