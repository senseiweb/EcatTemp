import 'inputMask'

export default class EcDirSpBehaviorResBar implements angular.IDirective {
    static directiveId = 'barSpBehaviorResults';

    scope = {
        dataset: '=dataset',
        legend: '@',
        callback: '=',
        onPlotClick: '&',
        onPlotHover: '&',
        onPlotSelected: '&',
        xticks: '=xticks',
        yticks: '=yticks'
    };

    spBreakoutOptions = {
        series: {
            bars: {
                show: true
            }
        },
        bars: {
            align: "center",
            barWidth: 0.5
        },
        yaxis: {
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 8,
            ticks: []
        },
        xaxis: {
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 8,
            ticks: []
        },
        legend: {
            noColumns: 0,
            labelBoxBorderColor: '#000000',
            position: 'nw'
        },
        grid: {
            borderWidth: 2,
            borderColor: '#eee',
        }
    }
    restrict = 'EA';

    newdata = [];

    link = (scope, element: angular.IAugmentedJQuery, attrs) => {
        this.spBreakoutOptions.xaxis.ticks = scope.xticks;
        this.spBreakoutOptions.yaxis.ticks = scope.yticks;
        this.newdata = [{ data: scope.dataset, color: '#3B4769'}];
        element.plot(this.newdata, this.spBreakoutOptions);
    }
}