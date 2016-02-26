System.register([], function(exports_1) {
    var EcFormControl;
    return {
        setters:[],
        execute: function() {
            EcFormControl = (function () {
                function EcFormControl() {
                    this.restrict = 'C';
                    this.link = function (scope, element, attrs) {
                        if (angular.element('html').hasClass('ie9')) {
                            jQuery('input, textarea').placeholder({
                                customClass: 'ie9-placeholder'
                            });
                        }
                    };
                }
                EcFormControl.directiveId = 'formControl';
                return EcFormControl;
            })();
            exports_1("default", EcFormControl);
        }
    }
});
