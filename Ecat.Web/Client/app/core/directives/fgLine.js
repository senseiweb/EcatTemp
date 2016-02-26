System.register([], function(exports_1) {
    var EcFgLine;
    return {
        setters:[],
        execute: function() {
            EcFgLine = (function () {
                function EcFgLine() {
                    this.restrict = 'C';
                    this.scope = {};
                    this.link = function (scope, element, attrs) {
                        element.on('focus', '.form-control', function () {
                            element
                                .addClass('fg-toggled');
                        });
                        element.on('blur', '.form-control', function () {
                            var hasValue = element.find('.form-control').val();
                            if (!hasValue) {
                                element
                                    .removeClass('fg-toggled');
                            }
                        });
                    };
                }
                EcFgLine.directiveId = 'fgLine';
                return EcFgLine;
            })();
            exports_1("default", EcFgLine);
        }
    }
});
