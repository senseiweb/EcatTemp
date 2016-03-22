
export default class EcDirSpBreakOutPie implements angular.IDirective {
    static directiveId = 'spBreakOutChart';
    breakOptsPie = {
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
            backgroundColor: 'white',
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
    breakOptsDonut= {
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

    breakOptsBar = {
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
            ticks: [[-2, 'IEA'], [-1, 'IEU'], [0, 'ND'], [1, 'EU'], [2, 'EA'], [3, 'HEU'], [4, 'HEA']]
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
    scope = {
        dataset: '=',
        legend: '@',
        callback: '=',
        onPlotClick: '&',
        onPlotHover: '&',
        onPlotSelected: '&',
        xticks: '='
    };
   
    link = (scope: ISpBoChartScope, element: angular.IAugmentedJQuery, attrs) => {
        let chartOps = null;

       
        switch (attrs.charttype) {
        case 'bar':
            this.breakOptsBar.xaxis.ticks = scope.xticks;
            scope.dataset = [{ data: scope.dataset, color: '#3B4769' }];
            chartOps = this.breakOptsBar;
            break;
        case 'pie':
            chartOps = this.breakOptsPie;
            break;
        case 'donut':
            chartOps = this.breakOptsDonut;
            break;
        }

        if (chartOps) chartOps.legend.container = `#${scope.legend}`;

        element.plot(scope.dataset, chartOps);

        scope.$watch('dataset', (newValue: any, oldValue: any) => {
            element.plot(newValue, chartOps);
        });

    }
        

}

interface ISpBoChartScope extends angular.IScope {
    dataset: any;
    legend: any;
    xticks: any;
}