var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var path = require('path');
var util = require('util');

var chartWidth = 500, chartHeight = 500;
var radius = Math.min(chartWidth, chartHeight) / 2;

var arc = d3.svg.arc()
    .outerRadius(chartWidth / 2 - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
        return d.val;
    });


/**
 * Generates a Pie-chart with random shades of HyperGrowth Red
 *
 * @param pieData ex. [{"label":"FAS","val":23},{"label":"Two","val":40},{"label":"Three","val":50},{"label":"Four","val":16},{"label":"Five","val":50},{"label":"Six","val":8},{"label":"Seven","val":30}]
 * @param callback
 * @returns {*}
 */
module.exports = function (pieData, callback) {
    if (!pieData) {
        return callback(new Error('No data to work on'));
    }

    var filename = 'pie_' + (new Date().getTime()) + '.svg';
    var outputLocation = path.join('gen', filename);

    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done: function (errors, window) {
            window.d3 = d3.select(window.document);

            var svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: chartWidth,
                    height: chartHeight
                })
                .append('g')
                .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartWidth / 2 + ')');

            var g = svg.selectAll('.arc')
                .data(pie(pieData))
                .enter();

            g.append('path')
                .attr({
                    'd': arc,
                    'fill': function (d, i) {
                        // Random
                        //var color = 'rgb(' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ', ' + Math.floor(255 * Math.random()) +')';

                        // Shades based off HyperGrowth Red
                        var color = 'rgb(' + Math.floor((200 * Math.random()) + 50) + ', 8, 8)';
                        return color;
                    },
                    'stroke': '#ccc'
                });

            g.append('text')
                .attr({
                    'fill' : '#fff',
                    'font-family': 'sans-serif',
                    'font-size' : '10',
                    'text-anchor': 'middle'
                })
                .attr({
                    'transform': function (d) {
                        return 'translate(' + labelArc.centroid(d) + ')';
                    }
                })
                .text(function (d) {
                    return d.data.label;
                });


            try {
                fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                callback(null, filename);
            } catch (err) {
                callback(err);
            }
        }
    });
};