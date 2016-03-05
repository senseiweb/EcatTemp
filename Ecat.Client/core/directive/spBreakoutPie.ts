import "inputMask"

interface ISpBreakOutPieAttrs extends angular.IAttributes {
    breakOut: {HE: number, E: number, ND: number, IE: number};
}

export default class EcDirSpBreakOutPie implements angular.IDirective {
    static directiveId = 'pieSpBreakOut';
    spBreakoutOptions = {
        series: {
            pie: {
                show: true,
                stroke: {
                    width: 2
                }
            }
        },
        legend: {
            container: '.flc-pie',
            backgroundOpacity: 0.5,
            noColumns: 0,
            backgroundColor: "white",
            lineWidth: 0
        },
        grid: {
            hoverable: true,
            clickable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: '%p.0%, %s', // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false,
            cssClass: 'flot-tooltip'
        }
    }
    restrict = 'EA';
    scope = {
        dataset: '=',
        legend: '@',
        callback: '=',
        onPlotClick: '&',
        onPlotHover: '&',
        onPlotSelected: '&'
    };
   
    link = (scope, element: angular.IAugmentedJQuery, attrs) => {
        this.spBreakoutOptions.legend.container = `#${scope.legend}`;
        element.plot(scope.dataset, this.spBreakoutOptions);
    }
        

}