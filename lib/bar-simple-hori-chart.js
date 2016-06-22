var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var path = require('path');
var util = require('util');

/**
 * Generates a simple horizontal bar chart with axis.
 *
 * @param barSimpleData ex. [{ "label": "01/05/2016", "hits": 30 }, { "label": "01/28/2016", "hits": 20 }, { "label": "02/18/2016", "hits": 42 }, { "label": "03/04/2016", "hits": 17 }, { "label": "04/05/2016", "hits": 30 }, { "label": "05/28/2016", "hits": 22 }, { "label": "06/18/2016", "hits": 34 }, { "label": "07/04/2016", "hits": 29 }, { "label": "08/18/2016", "hits": 18 }, { "label": "09/01/2016", "hits": 29 }]
 * @param callback
 * @returns {*}
 */
module.exports = function (barSimpleData, callback) {
    if (!barSimpleData) {
        return callback(new Error('No data to work on'));
    }

    var filename = 'bar-simple-h_' + (new Date().getTime()) + '.svg';

    var css = fs.readFileSync(path.join(__dirname, '../public', 'stylesheets', 'bar-simple.hori.css'), 'utf-8');
    var outputLocation = path.join('gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done: function (errors, window) {
            window.d3 = d3.select(window.document);
            var data = barSimpleData;

            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                barWidth = 30,
                height = barWidth * data.length * 1.5,
                width = height * 2;

            var x = d3.scale.linear()
                .range([0, width]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .2);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(10);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = window.d3.select("body")
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: width + margin.left + margin.right + 50,
                    height: height + margin.bottom + margin.top + 50
                });

            svg.append('rect')
                .attr({
                    id: 'svg_'+ (new Date().getTime()),
                    height: 10,
                    width: 10,
                    y: (height + margin.bottom + margin.top),
                    x: ((width + margin.left + margin.right) / 2),
                    fill: '#AB0808'
                });

            svg.append('text')
                .attr({
                    "xml:space" : 'preserve',
                    "dy" : '.32em',
                    "class" : 'legend',
                    "y" : (height + margin.bottom + margin.top) + 5,
                    "x" : ((width + margin.left + margin.right) / 2) + 35
                })
                .text('Hits');

            svg.append('style').html(css)
            svg = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain([0, d3.max(data, function (d) {
                return d.hits;
            })]);

            y.domain(data.map(function (d) {
                return d.label;
            }));

            svg.append("g")
                .attr("class", "y axis")
                .style()
                .attr("transform", "translate(50, 0)")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(0)")
                .attr("y", height + 50)
                .attr("dy", ".71em")

            svg.append("g")
                .attr("class", "x axis")
                .style()
                .attr("transform", "translate(50, " + height + ")")
                .call(xAxis);

            svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.label);
                })
                .attr("height", y.rangeBand())
                .attr("x", function (d) {
                    return 50;
                })
                .attr("width", function (d) {
                    return x(d.hits);
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