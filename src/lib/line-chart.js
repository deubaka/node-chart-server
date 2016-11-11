import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import colors from '../res/color';

export default (lineData, callback) => {
    if (!lineData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `line-chart_${new Date().getTime()}.svg`;

    const css = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'stylesheets', 'line-chart.css'), 'utf-8');
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = lineData;

            const colorRange = d3.scale
                .ordinal()
                .domain(lineData.map((d) => {
                    return d.yVal;
                }))
                .range(colors.Swatch.Google);
            const color = colorRange;

            const margin = {top: 20, right: 20, bottom: 50, left: 50},
                barWidth = 20,
                width = barWidth * data[0].length * 3,
                height = width / 2;

            const x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .2);

            const y = d3.scale.linear()
                .range([height, 0]);

            const xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(10);

            const yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .ticks(10);

            var lineGen = d3.svg.line()
                .x(function (d) {
                    return x(d.xVal);
                })
                .y(function (d) {
                    return y(d.yVal);
                })
                .interpolate("basis");

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: width + margin.left + margin.right,
                    height: height + margin.bottom + margin.top
                });

            svg.append('style').html(css);

            svg = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            x.domain(data[0].map(d => d.xVal));

            y.domain([0, d3.max(data[0], d => d.yVal)]);

            const xAxisGrid = () => {
                return d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
            };

            const yAxisGrid = () => {
                return d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .ticks(5);
            };

            svg.append('g')
                .attr('class', 'grid')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxisGrid()
                    .tickSize(-height, 0, 0)
                    .tickFormat('')
                );

            svg.append('g')
                .attr('class', 'grid')
                .call(yAxisGrid()
                    .tickSize(-width, 0, 0)
                    .tickFormat('')
                );

            svg.append('g')
                .attr('class', 'x axis')
                .style()
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-65)');

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)');

            let counter = 0;
            data.forEach((entry) => {
                svg.append('svg:path')
                    .attr('d', lineGen(entry))
                    .attr('stroke', color(counter++))
                    .attr('stroke-width', 2)
                    .attr('fill', 'none')
                    .attr('shape-rendering', 'geometricPrecision');
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