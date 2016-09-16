import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import util from 'util';
import colors from '../res/color';

const outerMargin = 25;
const chartWidth = 400, chartHeight = 400;
const donutWidth = 75;
const radius = Math.min(chartWidth, chartHeight) / 2;

const arc = d3.svg.arc()
    .outerRadius(radius - outerMargin)
    .innerRadius(radius - outerMargin - donutWidth);

const pie = d3.layout.pie()
    .padAngle(.01)
    .sort(null)
    .value(d => d.val);

const legendRectSize = 10;
const legendSpacing = 4;

export default (donutData, callback) => {
    if (!donutData) {
        return callback(new Error('No data to work on'));
    }

    const colorRange = d3.scale
        .ordinal()
        .domain(donutData.map(function(d) { return d.label; }))
        .range(colors.Swatch.Google);
    const color = colorRange;

    const filename = `donut_${new Date().getTime()}.svg`;
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);

    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);

            const svg = window.d3.select('body')
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
                .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

            const g = svg.selectAll('.arc')
                .data(pie(donutData))
                .enter();

            g.append('path')
                .attr({
                    'd': arc,
                    'fill': (d) => {
                        console.log('d: ' + util.inspect(d));
                        return color(d.data.label);
                    },
                    'shape-rendering': 'auto'
                });

            const legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = -3 * legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr({
                    'x': 0,
                    'y': 1 - legendSpacing,
                    'width': legendRectSize,
                    'height': legendRectSize
                })
                .style({
                    'fill': color,
                    'stroke': color,
                    'stroke-width': '2'
                });

            legend.append('text')
                .attr({
                    'x': legendRectSize + legendSpacing,
                    'y': legendRectSize - legendSpacing
                })
                .style('font-size', '10px')
                .style('font-family', 'sans-serif')
                .style('fill', '#615F72')
                .text((d) => {
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