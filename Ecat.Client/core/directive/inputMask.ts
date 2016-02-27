import "inputMask"

interface IInputMaskScope extends angular.IScope {
    inputMask: any;
}

export default class EcInputMask implements angular.IDirective {
    static directiveId = 'inputMask';
    restrict = 'A';
    scope = {
        inputMask: '='
    }
    link = (scope: IInputMaskScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        element.mask(scope.inputMask.mask);
    }
}