System.register([], function(exports_1) {
    var EcSubMenu;
    return {
        setters:[],
        execute: function() {
            EcSubMenu = (function () {
                function EcSubMenu() {
                    this.restrict = 'A';
                    this.link = function (scope, element, attrs) {
                        element.click(function () {
                            element.parent().toggleClass('toggled');
                            element.parent().find('ul').stop(true, false).slideToggle(200);
                        });
                    };
                }
                EcSubMenu.directiveId = 'toggleSubmenu';
                return EcSubMenu;
            })();
            exports_1("default", EcSubMenu);
        }
    }
});
