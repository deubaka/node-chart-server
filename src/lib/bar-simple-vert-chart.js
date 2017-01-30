import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import colors from '../res/color';

export default (barSimpleData, callback) => {
    if (!barSimpleData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `bar-simple-v_${new Date().getTime()}.svg`;

    const css = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'stylesheets', 'bar-simple.vert.css'), 'utf-8');
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = barSimpleData;

            const colorRange = d3.scale
                .ordinal()
                .domain(barSimpleData.map((d) => {
                    return d.label;
                }))
                .range(colors.Swatch.Google);
            const color = colorRange;

            const barWidth = 30,
                width = (barWidth * data.length * 3),
                height = width / 2,
                margin = {top: 20, right: 20, bottom: 80, left: 80}

            const x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .2);

            const y = d3.scale.linear()
                .range([height, 0]);

            const xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(5);

            const yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .ticks(5);

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: width + margin.left + margin.right,
                    height: height + margin.bottom + margin.top,

                });

            svg.append('rect')
                .attr('stroke', '#000000')
                .attr('stroke-width', 1)
                .attr('fill', 'none')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            svg = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            svg.append('style').html(css);

            // svg.append('text')
            //     .attr({
            //         'dy': '.32em',
            //         'class': 'legend',
            //         'y': (height + margin.bottom + margin.top) + 35,
            //         'x': ((width + margin.left + margin.right) / 2) + 35,
            //         'text-rendering': 'auto'
            //     })
            //     .text('Events');

            x.domain(data.map(d => d.label));

            y.domain([0, d3.max(data, d => d.val)]);

            // const xAxisGrid = () => {
            //     return d3.svg.axis()
            //         .scale(x)
            //         .orient('bottom')
            // };
            //
            // const yAxisGrid = () => {
            //     return d3.svg.axis()
            //         .scale(y)
            //         .orient('left')
            //         .ticks(5);
            // };

            // svg.append('g')
            //     .attr('class', 'grid')
            //     .attr('transform', `translate(0, ${height})`)
            //     .call(xAxisGrid()
            //         .tickSize(-height, 0, 0)
            //         .tickFormat('')
            //     );
            //
            // svg.append('g')
            //     .attr('class', 'grid')
            //     .call(yAxisGrid()
            //         .tickSize(-width, 0, 0)
            //         .tickFormat('')
            //     );

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

            svg.selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                // .attr('class', 'bar')
                .attr('x', d => x(d.label))
                .attr('width', x.rangeBand())
                .attr('y', d => y(d.val) - 1)
                .attr('height', d => height - y(d.val))
                .attr('fill', (d) => {
                    return color(d.label);
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