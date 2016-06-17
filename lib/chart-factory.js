var pieCharts = require('./pie-chart');
var barSimpleHoriCharts = require('./bar-simple-hori-chart');
var barSimpleVertCharts = require('./bar-simple-vert-chart');

module.exports = {
    Type: {
        PIE: 'chart.pie',
        BAR_SIMPLE_HORIZONTAL: 'chart.bar-simple-h',
        BAR_SIMPLE_VERTICAL: 'chart.bar-simple-v',
        LINE: 'chart.line'
    },
    createChartFor: function (chartType, data, callback) {
        switch (chartType) {
            case this.Type.PIE:
                console.log('Type.PIE');
                pieCharts(data, callback);
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
}