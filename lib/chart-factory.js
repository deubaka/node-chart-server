var pieCharts = require('./pie-chart');

module.exports = {
    Type: {
        PIE: 'chart.pie',
        LINE: 'chart.line'
    },
    createChartFor: function (chartType, data, callback) {
        switch (chartType) {
            case this.Type.PIE:
                console.log('Type.PIE');
                pieCharts(data, callback);
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