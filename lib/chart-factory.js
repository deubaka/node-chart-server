var pieCharts = require('./pie-chart');
var barSimpleCharts = require('./bar-simple-chart');

module.exports = {
    Type: {
        PIE: 'chart.pie',
        BAR_SIMPLE: 'chart.bar-simple',
        BAR_AXIS: 'chart.bar-axis',
        LINE: 'chart.line'
    },
    createChartFor: function (chartType, data, callback) {
        switch (chartType) {
            case this.Type.PIE:
                console.log('Type.PIE');
                pieCharts(data, callback);
                break;
            case this.Type.BAR_SIMPLE:
                console.log('Type.BAR_SIMPLE');
                barSimpleCharts(data, callback);
                break;
            case this.Type.BAR_AXIS:
                callback(new Error('Not yet implemented'));
                break;
            case this.Type.LINE:
                callback(new Error('Not yet implemented'));
                break;
            default:
                callback(new Error('No match'));
        }
    }
}