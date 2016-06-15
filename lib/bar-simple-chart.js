var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var path = require('path');
var util = require('util');

module.exports = function (barSimpleData, callback) {
    if (!barSimpleData) {
        return callback(new Error('No data to work on'));
    }

    var filename = 'test_bar-simple.svg';//'barsimple_' + (new Date().getTime()) + '.svg';
    var outputLocation = path.join('gen', filename);

    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done: function (errors, window) {
            window.d3 = d3.select(window.document);

            var chartWidth = 500, barHeight = 35;

            var x = d3.scale.linear()
                .domain([0, d3.max(barSimpleData)])
                .range([0, chartWidth]);

            var svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: chartWidth,
                    height: (barHeight * barSimpleData.length) + 100
                });

            var bar = svg.selectAll('g')
                .data(barSimpleData)
                .enter()
                .append('g')
                .attr({
                    'transform': function (d, i) {
                        return 'translate(0,' + i * barHeight + ')';
                    }
                });

            bar.append('rect')
                .attr({
                    width: x,
                    height: barHeight - 3,
                    'fill': function (d, i) {
                        if ((barSimpleData.length - 1) === i) {
                            // Highlight last
                            return '#AB0808';
                        } else {
                            return '#615F72';
                        }
                    }
                });

            bar.append('text')
                .attr({
                    x: function (d) {
                        return x(d) - 10;
                    },
                    y: (barHeight / 2) - 1,
                    dy: '.35em',
                    fill: '#fff',
                    'font-family': 'sans-serif',
                    'font-size': '10',
                    'text-anchor': 'end'
                })
                .text(function (d) {
                    return d;
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