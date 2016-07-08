import pieCharts from './pie-chart';
import donutCharts from './donut-chart';
import barSimpleHoriCharts from './bar-simple-hori-chart';
import barSimpleVertCharts from './bar-simple-vert-chart';

export default {
    Type: {
        PIE: 'chart.pie',
        DONUT : 'chart.donut',
        BAR_SIMPLE_HORIZONTAL: 'chart.bar-simple-h',
        BAR_SIMPLE_VERTICAL: 'chart.bar-simple-v',
        LINE: 'chart.line'
    },
    createChartFor(chartType, data, callback) {
        switch (chartType) {
            case this.Type.PIE:
                console.log('Type.PIE');
                pieCharts(data, callback);
                break;
            case this.Type.DONUT:
                console.log('Type.DONUT');
                donutCharts(data, callback);
                break;
            case this.Type.BAR_SIMPLE_HORIZONTAL:
                console.log('Type.BAR_SIMPLE_HORIZONTAL');
                barSimpleHoriCharts(data, callback);
                break;
            case this.Type.BAR_SIMPLE_VERTICAL:
                console.log('Type.BAR_SIMPLE_VERTICAL');
                barSimpleVertCharts(data, callback);
                break;
            case this.Type.LINE:
                callback(new Error('Not yet implemented'));
                break;
            default:
                callback(new Error('No match'));
        }
    }
};