import IDataCtx from "core/service/data/context"

export default class EcEmailValidator {
    static directiveId = 'uniqueEmailValidator';
    restrict = 'A';
    require = 'ngModel';

    constructor(private $q: angular.IQService, private dataCtx: IDataCtx) { }

    link = (scope: angular.IScope,
        element: angular.IAugmentedJQuery,
        attr: angular.IAttributes,
        ngModel: angular.INgModelController) => {
        ngModel.$asyncValidators['uniqueEmail'] = (modelValue, viewValue) => {
            const value = modelValue || viewValue;
            if (!value) {
                return this.$q.reject(false);
            }
            return this.dataCtx.user.emailIsUnique(viewValue).then((isEmailUnique) => {
                if (isEmailUnique) {
                    return this.$q.resolve(true);
                }
                return this.$q.reject(false);
            }).catch(() => this.$q.reject(false));
        }
    }
}