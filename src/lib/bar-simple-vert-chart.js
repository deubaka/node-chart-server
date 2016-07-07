import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';

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

            const margin = {top: 20, right: 20, bottom: 30, left: 40}, barWidth = 30, width = (barWidth * data.length * 2), height = width / 2;

            const x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .2);

            const y = d3.scale.linear()
                .range([height, 0]);

            const xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            const yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .ticks(10);

            let svg = window.d3.select('body')
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
                    id: `svg_${new Date().getTime()}`,
                    height: 10,
                    width: 10,
                    y: (height + margin.bottom + margin.top),
                    x: ((width + margin.left + margin.right) / 2),
                    fill: '#AB0808'
                });

            svg.append('text')
                .attr({
                    'xml:space' : 'preserve',
                    'dy' : '.32em',
                    'class' : 'legend',
                    'y' : (height + margin.bottom + margin.top) + 5,
                    'x' : ((width + margin.left + margin.right) / 2) + 35
                })
                .text('Hits');

            svg.append('style').html(css);
            svg = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            x.domain(data.map(d => d.label));

            y.domain([0, d3.max(data, d => d.hits)]);

            svg.append('g')
                .attr('class', 'x axis')
                .style()
                .attr('transform', `translate(0,${height})`)
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)');

            svg.selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.label))
                .attr('width', x.rangeBand())
                .attr('y', d => y(d.hits) - 1)
                .attr('height', d => height - y(d.hits));
            try {
                fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                callback(null, filename);
            } catch (err) {
                callback(err);
            }
        }
    });
};