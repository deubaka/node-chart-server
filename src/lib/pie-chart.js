import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import colors from '../res/color';

const outerMargin = 25;
const chartWidth = 500, chartHeight = 400;
const radius = Math.min(chartWidth, chartHeight) / 2 - outerMargin;

const arc = d3.svg.arc()
    .outerRadius(radius - outerMargin);

const labelArc = d3.svg.arc()
    .outerRadius(radius - (100 - outerMargin))
    .innerRadius(radius - (100 - outerMargin));

const pie = d3.layout.pie()
    .sort(null)
    .value(d => d.val);

const legendRectSize = 12;
const legendSpacing = 4;

export default (pieData, callback) => {
    if (!pieData) {
        return callback(new Error('No data to work on'));
    }
    const colorRange = d3.scale
        .ordinal()
        .domain(pieData.map(function (d) {
            return d.label;
        }))
        .range(colors.Swatch.Hyper);
    const color = colorRange;

    const filename = `pie_${new Date().getTime()}.svg`;
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
                .attr('transform', `translate(${chartWidth / 3},${chartHeight / 2})`);

            const g = svg.selectAll('.arc')
                .data(pie(pieData))
                .enter();

            g.append('path')
                .attr({
                    'd': arc,
                    'fill': (d, i) => {
                        return color(d.data.label);
                    },
                    'shape-rendering': 'auto'
                });

            g.append('text')
                .attr({
                    'transform': (d) => {
                        return `translate(${labelArc.centroid(d)})`;
                    },
                    'text-rendering': 'auto'
                })
                .attr({
                    'fill': '#fff',
                    'font-family': 'sans-serif',
                    'font-size': '10px',
                    'text-rendering': 'auto',
                    'text-anchor': (d) => {
                        return (d.endAngle + d.startAngle) / 2 > Math.PI ?
                            'end' : 'start';
                    }
                })
                .text(d => {
                    return (d.endAngle + d.startAngle) / 2 > Math.PI ? d.data.val + ' •' : '• ' + d.data.val;
                });

            const legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = (chartWidth / 5) + 100;
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
                .style('font-size', '12px')
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