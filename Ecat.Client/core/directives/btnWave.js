System.register([], function(exports_1) {
    var EcBtnWaves;
    return {
        setters:[],
        execute: function() {
            EcBtnWaves = (function () {
                function EcBtnWaves() {
                    this.restrict = 'C';
                    this.link = function (scope, element, attrs) {
                        if (element.hasClass('btn-icon') || element.hasClass('btn-float')) {
                            Waves.attach(element, ['waves-circle']);
                        }
                        else if (element.hasClass('btn-light')) {
                            Waves.attach(element, ['waves-light']);
                        }
                        else {
                            Waves.attach(element);
                        }
                        Waves.init();
                    };
                }
                EcBtnWaves.directiveId = 'btn';
                return EcBtnWaves;
            })();
            exports_1("default", EcBtnWaves);
        }
    }
});
