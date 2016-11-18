import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import _ from 'lodash';
import colors from './../res/color';
import LineChart from './line-chart';

export default (revenueSumary, callback) => {
    if (!revenueSumary) {
        return callback(new Error('No data to work on'));
    }

    const filename = `revenue-summary_${new Date().getTime()}.svg`;
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = revenueSumary;

            const margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }, height = 415, width = 360;

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    version: '1.1',
                    width: width,
                    height: height
                });

            svg = svg.append('g');

            // Title
            svg.append('text')
                .attr({
                    'font-size': 13,
                    'text-anchor': 'middle',
                    'y': 30,
                    'x': width / 2,
                    'fill': '#1A1A1A',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text(data.title.toUpperCase());


            /*------- Total Revenue Box -------*/
            // Green box
            svg.append('rect')
                .attr({
                    'y': 45,
                    'x': 20,
                    'width': 120,
                    'height': 110,
                    'fill': '#165B21'
                });

            // Total Revenue  Label
            svg.append('text')
                .attr({
                    'font-size': 13,
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': 80,
                    'fill': '#fff',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text('Total Revenue');

            // Total Revenue  Value

            let titleSize = 27;
            let currencyX = 112;

            if (Number(data.totalRevenue) > 9999) {
                titleSize = 25;
                currencyX = 135;
            } else if (Number(data.totalRevenue) > 999) {
                currencyX = 130;
            } else if (Number(data.totalRevenue) > 99) {
                currencyX = 120;
            }

            svg.append('text')
                .attr({
                    'font-size': titleSize,
                    'text-anchor': 'middle',
                    'y': 110,
                    'x': 80,
                    'fill': '#fff',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text(`${Number(data.totalRevenue).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`);

            svg.append('text')
                .attr({
                    'font-size': 13,
                    'text-anchor': 'end',
                    'y': 125,
                    'x': currencyX,
                    'fill': '#fff',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text('US$');

            // // Android
            // svg.append('text')
            //     .attr({
            //         'font-size': 8,
            //         'text-anchor': 'right',
            //         'y': 110,
            //         'x': 80,
            //         'fill': '#fff',
            //         'xml:space': 'preserve',
            //         'style': 'font-family:Helvetica; font-weight: 200;',
            //         'text-rendering': 'geometricPrecision'
            //     })
            //     .text('Android');
            //
            // // Android
            // svg.append('text')
            //     .attr({
            //         'font-size': 8,
            //         'text-anchor': 'left',
            //         'y': 110,
            //         'x': 85,
            //         'fill': '#fff',
            //         'xml:space': 'preserve',
            //         'style': 'font-family:Helvetica; font-weight: 100;',
            //         'text-rendering': 'geometricPrecision'
            //     })
            //     .text('65,123');
            //
            // // iOS
            // svg.append('text')
            //     .attr({
            //         'font-size': 8,
            //         'text-anchor': 'right',
            //         'y': 120,
            //         'x': 80,
            //         'fill': '#fff',
            //         'xml:space': 'preserve',
            //         'style': 'font-family:Helvetica; font-weight: 200;',
            //         'text-rendering': 'geometricPrecision'
            //     })
            //     .text('iOS');
            //
            // // iOS
            // svg.append('text')
            //     .attr({
            //         'font-size': 8,
            //         'text-anchor': 'left',
            //         'y': 120,
            //         'x': 85,
            //         'fill': '#fff',
            //         'xml:space': 'preserve',
            //         'style': 'font-family:Helvetica; font-weight: 100;',
            //         'text-rendering': 'geometricPrecision'
            //     })
            //     .text('65,123');

            /*------- Top Countries -------*/
            // Top Countries  Label
            svg.append('text')
                .attr({
                    'font-size': 13,
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': 250,
                    'fill': '#1A1A1A',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text('Top Countries');

            const sum = _.reduce(data.topCountries, (sum, n) => {
                const topCountry = n;
                return sum + topCountry.value;
            }, 0);

            const maxBarChart = 320;

            let index = 0;
            data.topCountries.forEach((topCountry) => {
                const barWidth = Math.ceil((topCountry.value / sum) * maxBarChart) - 5;

                console.log(`chart[${index}]=${barWidth}`)
                svg.append('rect')
                    .attr({
                        'fill': colors.Swatch.Keynote[index++],
                        'y': 60 + (index * 25),
                        'x': 160,
                        'height': 10,
                        'width': barWidth
                    });

                svg.append('text')
                    .attr({
                        'font-size': '12pt',
                        'text-anchor': 'left',
                        'y': 120 + (index * 50) - 6,
                        'x': 320,
                        'fill': '#1A1A1A',
                        'font-weight': 400,
                        'font-family': 'Helvetica',
                        'transform': 'scale(0.5)'
                    })
                    .text(topCountry.name);

                svg.append('text')
                    .attr({
                        'font-size': '6pt',
                        'text-anchor': 'left',
                        'y': 60 + (index * 25) + 7.5,
                        'x': (160) + barWidth + 3,
                        'fill': '#1A1A1A',
                        'font-weight': 400,
                        'font-family': 'Helvetica'
                    })
                    .text(`US$ ${topCountry.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`);
            });

            /*------ Daily Breakdown ------*/
            /*------- Line Chart -------*/
            LineChart(data.data, (err, svgFilename) => {
                const lineChartSvg = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                const stripped = lineChartSvg.replace(/<+\/?svg[\W\w]*?>/gi, '');
                console.log(`***** lineChartSvg: ${stripped}`)

                // Title
                svg.append('text')
                    .attr({
                        'font-size': 13,
                        'text-anchor': 'middle',
                        'y': 195,
                        'x': width / 2,
                        'fill': '#1A1A1A',
                        'font-weight': 700,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text('Daily Breakdown');

                svg.append('g')
                    .attr('transform', 'translate(-15,200)')
                    .html(stripped);


                svg.append('text')
                    .attr({
                        'dy': '.32em',
                        'font-size': 7,
                        'y': height - 20,
                        'x': (width / 2),
                        'text-rendering': 'auto',
                        'fill': '#000',
                        'stroke': 'none',
                        'text-anchor': 'middle',
                        'font-weight': 700,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(data.xAxisLabel || 'Date');

                svg.append('text')
                    .attr({
                        'y': (height / 2),
                        'x': '0',
                        'text-rendering': 'auto',
                        'font-weight': 700,
                        'font-family': 'Helvetica',
                        'font-size': 7,
                        'fill': '#000',
                        'stroke': 'none',
                        'text-anchor': 'middle',
                        'transform': `translate(-195, 290) rotate(-90)`,
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(data.yAxisLabel || 'US$ Sales');

                try {
                    fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                    callback(null, filename);
                } catch (err) {
                    callback(err);
                }
            })
        }
    });
};