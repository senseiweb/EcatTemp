System.register(["inputMask"], function(exports_1) {
    var EcInputMask;
    return {
        setters:[
            function (_1) {}],
        execute: function() {
            EcInputMask = (function () {
                function EcInputMask() {
                    this.restrict = 'A';
                    this.scope = {
                        inputMask: '='
                    };
                    this.link = function (scope, element, attrs) {
                        element.mask(scope.inputMask.mask);
                    };
                }
                EcInputMask.directiveId = 'inputMask';
                return EcInputMask;
            })();
            exports_1("default", EcInputMask);
        }
    }
});
