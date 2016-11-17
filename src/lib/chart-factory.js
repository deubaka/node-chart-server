import pieCharts from './pie-chart';
import donutCharts from './donut-chart';
import barSimpleHoriCharts from './bar-simple-hori-chart';
import barSimpleVertCharts from './bar-simple-vert-chart';
import reviewsScorecard from './reviews-scorecard-chart';
import installSummary from './install-summary-chart';
import lineChart from './line-chart';

export default {
    Type: {
        PIE: 'chart.pie',
        DONUT : 'chart.donut',
        BAR_SIMPLE_HORIZONTAL: 'chart.bar-simple-h',
        BAR_SIMPLE_VERTICAL: 'chart.bar-simple-v',
        LINE: 'chart.line',
        REVIEWS_SCORECARD : 'chart.reviews-scorecard',
        INSTALL_SUMMARY : 'chart.install-summary'
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
                console.log('Type.LINE');
                lineChart(data, callback)
                break;
            case this.Type.REVIEWS_SCORECARD:
                reviewsScorecard(data, callback);
                break;
            case this.Type.INSTALL_SUMMARY:
                installSummary(data, callback);
                break;
            default:
                callback(new Error('No match'));
        }
    }
};