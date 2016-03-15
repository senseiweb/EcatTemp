

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
<<<<<<< c9589c61cd696531c458a4b2ab9c2b3483977ccd
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


  spBreakoutOptionsDonut = {
        series: {
            pie: {
                innerRadius: 0.5,
                show: true,
                stroke: {
                    width: 2
                }
            }
        },
        legend: {
            noColumns: 0,
            labelBoxBorderColor: '#000000',
            position: 'nw'
        },
        grid: {
            show: true,
            hoverable: true,
            clickable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: '%p.0%, %n %s', // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false,
            cssClass: 'flot-tooltip'
        }
    }
    restrict = 'EA';

    newdata = [];

    link = (scope, element: angular.IAugmentedJQuery, attrs) => {

        this.spBreakoutOptions.xaxis.ticks = scope.xticks;
        this.spBreakoutOptions.yaxis.ticks = scope.yticks;
        this.newdata = [{ data: scope.dataset, color: '#3B4769'}];
        element.plot(this.newdata, this.spBreakoutOptions);


        this.spBreakoutOptions.legend.container = `#${scope.legend}`;
        console.log(scope.dataset);
        element.plot(scope.dataset, this.spBreakoutOptions);
    }
}