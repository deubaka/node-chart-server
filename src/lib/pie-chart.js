import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';

const chartWidth = 500, chartHeight = 500;
const radius = Math.min(chartWidth, chartHeight) / 2;

const arc = d3.svg.arc()
    .outerRadius(chartWidth / 2 - 10)
    .innerRadius(0);

const labelArc = d3.svg.arc()
    .outerRadius(radius - 100)
    .innerRadius(radius - 100);

const pie = d3.layout.pie()
    .sort(null)
    .value(d => d.val);

export default (pieData, callback) => {
    if (!pieData) {
        return callback(new Error('No data to work on'));
    }

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
                .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);

            const g = svg.selectAll('.arc')
                .data(pie(pieData))
                .enter();

            g.append('path')
                .attr({
                    'd': arc,
                    'fill'(d, i) {
                        // Random
                        //var color = 'rgb(' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ', ' + Math.floor(255 * Math.random()) +')';

                        // Shades based off HyperGrowth Red
                        return `rgb(${Math.floor((200 * Math.random()) + 50)}, 8, 8)`;
                    },
                    'stroke': '#ccc',
                    'shape-rendering': 'auto'
                });

            g.append('text')
                .attr({
                    'transform'(d) {
                        return `translate(${labelArc.centroid(d)})`;
                    },
                    'text-rendering': 'auto'
                })
                .style()
                .attr({
                    'fill': '#fff',
                    'font-family': 'sans-serif',
                    'font-size': '12',
                    'text-anchor': 'middle',
                    'text-rendering': 'auto'
                })
                .text(d => d.data.label);
            try {
                fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                callback(null, filename);
            } catch (err) {
                callback(err);
            }
        }
    });
};