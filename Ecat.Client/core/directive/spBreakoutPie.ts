import "inputMask"

interface ISpBreakOutPieAttrs extends angular.IAttributes {
    breakOut: {HE: number, E: number, ND: number, IE: number};
}

export default class EcDirSpBreakOutPie implements angular.IDirective {
    static directiveId = 'pieSpBreakOut';
    restrict = 'A';
    scope = {
        inputMask: '='
    }
    link = (scope: any, element: angular.IAugmentedJQuery, attrs: ISpBreakOutPieAttrs) => {
        element.mask(scope.inputMask.mask);
    }
}