System.register([], function(exports_1) {
    var EcCompareTo;
    return {
        setters:[],
        execute: function() {
            EcCompareTo = (function () {
                function EcCompareTo() {
                    this.require = 'ngModel';
                    this.scope = {
                        otherModelValue: '=compareTo'
                    };
                    this.restrict = 'A';
                    this.link = function (scope, element, attrs, ngModel) {
                        ngModel.$validators['compareTo'] = function (modelValue) { return modelValue === scope.otherModelValue; };
                        scope.$watch('otherModelValue', function () { return ngModel.$validate(); });
                    };
                }
                EcCompareTo.directiveId = 'compareTo';
                return EcCompareTo;
            })();
            exports_1("default", EcCompareTo);
        }
    }
});
