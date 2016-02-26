System.register([], function(exports_1) {
    var EcEmailValidator;
    return {
        setters:[],
        execute: function() {
            EcEmailValidator = (function () {
                function EcEmailValidator($q, dataCtx) {
                    var _this = this;
                    this.$q = $q;
                    this.dataCtx = dataCtx;
                    this.restrict = 'A';
                    this.require = 'ngModel';
                    this.link = function (scope, element, attr, ngModel) {
                        ngModel.$asyncValidators['uniqueEmail'] = function (modelValue, viewValue) {
                            var value = modelValue || viewValue;
                            if (!value) {
                                return _this.$q.reject(false);
                            }
                            return _this.dataCtx.user.emailIsUnique(viewValue).then(function (isEmailUnique) {
                                if (isEmailUnique) {
                                    return _this.$q.resolve(true);
                                }
                                return _this.$q.reject(false);
                            }).catch(function () { return _this.$q.reject(false); });
                        };
                    };
                }
                EcEmailValidator.directiveId = 'uniqueEmailValidator';
                return EcEmailValidator;
            })();
            exports_1("default", EcEmailValidator);
        }
    }
});
