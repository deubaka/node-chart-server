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

    // const css = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'stylesheets', 'line-chart.css'), 'utf-8');
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = lineData;

            const margin = {top: 20, right: 20, bottom: 50, left: 50},
                width = 300,
                height = width / 2;

            const x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .15);

            const y = d3.scale.linear()
                .range([height, 0]);

            const xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .tickPadding(8)
                .ticks(10);

            const yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .ticks(5);

            var lineGen = d3.svg.line()
                .x((d) => {
                    return x(d.xVal);
                })
                .y((d) => {
                    return y(d.yVal);
                })
                .interpolate("linear");

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: width + margin.left,
                    height: height + margin.bottom + margin.top
                });

            // svg.append('style').html(css);

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

            // svg.append('g')
            //     .attr('class', 'grid')
            //     .attr('transform', `translate(0, ${height})`)
            //     .attr('style', 'stroke: #e6e6e6; opacity: 0.7; shape-rendering: crispEdges; stroke-width: 0;')
            //     .call(xAxisGrid()
            //         .tickSize(-height, 0, 0)
            //         .tickFormat('')
            //     );

            svg.append('g')
                .attr('class', 'grid')
                .attr('style', 'stroke: #e6e6e6; opacity: 0.7; shape-rendering: crispEdges; stroke-width: 1;')
                .call(yAxisGrid()
                    .tickSize(-width, 0, 0)
                    .tickFormat('')
                );

            svg.append('g')
                .attr('class', 'x axis')
                .attr('font-family', 'Helvetica')
                .attr('font-size', '8px')
                .attr('font-weight', 400)
                .attr('fill', 'none')
                .attr('stroke', '#e6e6e6')
                .attr('shape-rendering', 'crispEdges')
                .style()
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)
                .selectAll('text')
                .attr('dy', '5')
                .attr('font-family', 'Helvetica')
                .attr('font-size', '8px')
                .attr('font-weight', 400)
                .attr('fill', '#000')
                .attr('stroke', 'none')
                .attr('style', 'text-anchor: middle');

            svg.append('g')
                .attr('class', 'y axis')
                .attr('font-size', '8px')
                .attr('font-weight', 400)
                .attr('fill', 'none')
                .attr('stroke', '#e6e6e6')
                .attr('shape-rendering', 'crispEdges')
                .call(yAxis)
                .selectAll('text')
                .attr('dx', '.15em')
                .attr('dy', '.15em')
                .attr('font-family', 'Helvetica')
                .attr('font-size', '8px')
                .attr('font-weight', 400)
                .attr('fill', '#000')
                .attr('stroke', 'none')
                .attr('style', 'text-anchor: end');

            data.forEach((entry) => {
                svg.append('svg:path')
                    .attr('d', lineGen(entry))
                    .attr('stroke', colors.Swatch.Keynote[0])
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