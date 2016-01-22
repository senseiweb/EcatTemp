interface IEcCompareToScope extends angular.IScope
{
    otherModelValue: string;
}

export default class EcCompareTo implements angular.IDirective {
    static directiveId = 'compareTo';
    require = 'ngModel';
    scope = {
        otherModelValue: '=compareTo'
    }
    restrict = 'A';

    link = (scope: IEcCompareToScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ngModel: angular.INgModelController) => {
        ngModel.$validators['compareTo'] = (modelValue) => modelValue === scope.otherModelValue;
        scope.$watch('otherModelValue', () => ngModel.$validate());
    }
   
}