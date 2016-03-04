import "inputMask"

interface ISpBreakOutPieAttrs extends angular.IAttributes {
    breakOut: {HE: number, E: number, ND: number, IE: number};
}

export default class EcDirSpBreakOutPie implements angular.IDirective {
    static directiveId = 'pieSpBreakOut';
    
    restrict = 'E';
    scope = {};
    bindToController = {
        dataset: '=',
        options: '=',
        callback: '=',
        onPlotClick: '&',
        onPlotHover: '&',
        onPlotSelected: '&'
    }
    controllerAs = 'spbo';
    controller = ($scope, $element) => {
        const options =  $scope.$parent.options;
        console.log(options);
    }

}