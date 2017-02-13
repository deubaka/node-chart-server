import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import async from 'async';
import util from 'util';
import InstallSummaryChart from './install-summary-chart';
import RevenueSummaryChart from './revenue-summary-chart';
import LineChart from './line-chart';
import ReviewsScorecard from './reviews-scorecard-chart';
import AppsListChart from './apps-list-chart';
import ReviewsListChart from './reviews-list-chart';

export default (scheduledReportsData, callback) => {
    if (!scheduledReportsData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `scheduled-report_${new Date().getTime()}.svg`;
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = scheduledReportsData;

            const margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }, height = 1200, width = 1100;

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    version: '1.1',
                    width: width + margin.left + margin.right,
                    height: height + margin.top + margin.bottom
                });

            svg.append('rect')
                .attr('fill', '#fff')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            svg = svg.append('g')
                .attr('transform', `translate(0,${margin.top})`);

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

            async.series({
                    generateInstallSummary: (cb) => {
                        InstallSummaryChart(data.install_summary, (err, svgFilename) => {
                            const installSummaryChart = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = installSummaryChart.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** installSummaryChart: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${(width / 2) - 470}, 70)`)
                                .html(stripped);

                            cb(err, svg);
                        })
                    },
                    generateRevenueSummary: (cb) => {
                        RevenueSummaryChart(data.revenue_summary, (err, svgFilename) => {
                            const revenueSummaryChart = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = revenueSummaryChart.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** revenueSummaryChart: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${((width / 2) + 40)}, 70)`)
                                .html(stripped);

                            cb(err, svg);
                        })
                    },
                    generateDAULineChart: (cb) => {
                        LineChart(data.dau, (err, svgFilename) => {
                            const dauChart = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = dauChart.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** dauChart: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${((width / 2) - 470)},460)`)
                                .html(stripped);

                            cb(err, svg);
                        })
                    },
                    generateDPULineChart: (cb) => {
                        LineChart(data.dpu, (err, svgFilename) => {
                            const dpuChart = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = dpuChart.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** dpuChart: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${((width / 2)) + 40},460)`)
                                .html(stripped);

                            cb(err, svg);
                        })
                    },
                    generateReviewsScorecard: (cb) => {
                        ReviewsScorecard(data.reviews_summary, (err, svgFilename) => {
                            const reviewsScorecard = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = reviewsScorecard.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** reviewsScorecard: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${((width / 2)) - 490},700)`)
                                .html(stripped);

                            cb(null, svg);
                        })
                    },
                    generateAppsList: (cb) => {
                        AppsListChart(data.apps_data, (err, svgFilename) => {
                            const appsListChart = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = appsListChart.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** appsListChart: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${((width / 2)) - 510},1020)`)
                                .html(stripped);

                            cb(err, svg);
                        })
                    },
                    generateReviews : (cb) => {
                        ReviewsListChart(data.reviews_data, (err, svgFilename) => {
                            const reviewsListChart = fs.readFileSync(path.join(__dirname, '..', '..', 'gen', svgFilename), 'utf-8');

                            const stripped = reviewsListChart.replace(/<+\/?svg[\W\w]*?>/gi, '');
                            console.log(`***** reviewsListChart: ${stripped}`);

                            svg.append('g')
                                .attr('transform', `translate(${((width / 2)) + 20},700)`)
                                .html(stripped);

                            cb(err, svg);
                        })
                    }
                },
                (err, results) => {
                    console.log(`** err: ${util.inspect(err)}`);
                    console.log(`** results: ${util.inspect(results)}`);

                    try {
                        fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                        callback(err, filename);
                    } catch (err) {
                        callback(err);
                    }
                });
        }
    });
};