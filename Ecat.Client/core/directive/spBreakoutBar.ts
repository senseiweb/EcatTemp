import 'inputMask'

interface ISpBreakOutPieAttrs extends angular.IAttributes {
    breakOut: {HE: number, E: number, ND: number, IE: number};
}

export default class EcDirSpBreakOutBar implements angular.IDirective {
    static directiveId = 'barSpBreakOut';

    data1 = [[1, 60], [2, 30], [3, 50], [4, 100], [5, 10], [6, 90], [7, 85]];
    data2 = [[1, 20], [2, 90], [3, 60], [4, 40], [5, 100], [6, 25], [7, 65]];
    data3 = [[1, 100], [2, 20], [3, 60], [4, 90], [5, 80], [6, 10], [7, 5]];
    barData = [
        {
            data: this.data1,
            label: 'Tokyo',
            bars: {
                show: true,
                barWidth: 0.08,
                order: 1,
                lineWidth: 0,
                fillColor: '#8BC34A'
            }
        }, {
            data: this.data2,
            label: 'Seoul',
            bars: {
                show: true,
                barWidth: 0.08,
                order: 2,
                lineWidth: 0,
                fillColor: '#00BCD4'
            }
        }, {
            data: this.data3,
            label: 'Beijing',
            bars: {
                show: true,
                barWidth: 0.08,
                order: 3,
                lineWidth: 0,
                fillColor: '#FF9800'
            }
        }
    ];
    spBreakoutOptions = {
        yaxis: {
            tickColor: '#eee',
            tickDecimals: 0,
            font: {
                lineHeight: 13,
                style: "normal",
                color: "#9f9f9f",
            },
            shadowSize: 0
        },
        xaxis: {
            tickColor: '#fff',
            tickDecimals: 0,
            font: {
                lineHeight: 13,
                style: "normal",
                color: "#9f9f9f"
            },
            shadowSize: 0,
        },
        legend: {
            container: '.flc-pie',
            backgroundOpacity: 0.5,
            noColumns: 0,
            backgroundColor: 'white',
            lineWidth: 0
        },
        grid: {
            borderWidth: 1,
            borderColor: '#eee',
            show: true,
            hoverable: true,
            clickable: true
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
        element.plot(this.barData, this.spBreakoutOptions);
    }
}