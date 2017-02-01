import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';

export default (reviewsScorecardData, callback) => {
    if (!reviewsScorecardData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `reviews-scorecard_${new Date().getTime()}.svg`;
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = reviewsScorecardData;

            const margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }, height = data.topWords && data.topWords.length > 3 ? 300 : 270, width = 500;

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    version: '1.1',
                    width: width,
                    height: height
                });

            svg = svg.append('g');

            svg.append('rect')
                .attr({
                    'stroke': '#e5e5e5',
                    'height': height - margin.bottom - margin.top,
                    'width': width - margin.right - margin.left,
                    'y': margin.top,
                    'x': margin.left,
                    'fill': '#ffffff',
                    'shape-rendering': 'crispEdges',
                    'rx': 6,
                    'ry': 6
                });

            const maxSentimentBar = width - (3 * margin.left) - (3 * margin.right);
            const positiveWidth = Math.ceil((data.positivePercentage / 100) * maxSentimentBar);
            const neutralWidth = Math.ceil((data.neutralPercentage / 100) * maxSentimentBar);
            const negativeWidth = Math.ceil((data.negativePercentage / 100) * maxSentimentBar);

            // Positive
            const positiveX = (width - maxSentimentBar) / 2;
            if (data.positivePercentage > 0) {
                svg.append('rect')
                    .attr({
                        'stroke': '#ffffff',
                        'stroke-width': 0,
                        'height': 30,
                        'width': positiveWidth,
                        'y': 121,
                        'x': positiveX,
                        'fill': '#118730',
                        'shape-rendering': 'crispEdges',
                    });
            }

            // Neutral
            const neutralX = positiveX + positiveWidth + 1;
            if (data.neutralPercentage > 0) {
                svg.append('rect')
                    .attr({
                        'stroke': '#ffffff',
                        'stroke-width': 0,
                        'height': 30,
                        'width': neutralWidth,
                        'y': 121,
                        'x': neutralX,
                        'fill': '#dd8a3a',
                        'shape-rendering': 'crispEdges'
                    });
            }

            // Negative
            const negativeX = neutralX + neutralWidth + 1;
            if (data.negativePercentage > 0) {
                svg.append('rect')
                    .attr({
                        'stroke': '#ffffff',
                        'stroke-width': 0,
                        'height': 30,
                        'width': negativeWidth,
                        'y': 121,
                        'x': negativeX,
                        'fill': '#c62817',
                        'shape-rendering': 'crispEdges'
                    });
            }

            svg.append('text')
                .attr({
                    'font-size': 11,
                    'text-anchor': 'middle',
                    'y': 166,
                    'x': width / 2,
                    'fill': '#000000',
                    'xml:space': 'preserve',
                    'style': 'font-family: \'Helvetica\'; font-weight: 100;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text(data.topVersion);

            svg.append('text')
                .attr({
                    'font-size': 15,
                    'text-anchor': 'middle',
                    'y': 202,
                    'x': width / 2,
                    'fill': '#000',
                    'xml:space': 'preserve',
                    'style': 'font-family: \'Helvetica\'; font-weight: 600;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text('Top Keywords');

            const rectIndeces = [];
            const limit = data.topWords.length > 3 ? 3 : data.topWords.length;
            if (data.hasOwnProperty('topWords') && data.topWords instanceof Array) {
                for (var count = 0, buffer = 0; count < data.topWords.length; count++, buffer++) {
                    // Others Comment
                    if (buffer > 2) {
                        buffer = 0; // Reset for new row
                    }

                    rectIndeces[count] = ((width - (110 * limit)) / 2) + (110 * count) + 10;

                    console.log(`#### rectIndeces[${count}] :: getting rectIndeces[${buffer}]=${rectIndeces[buffer]}`)
                    svg.append('rect')
                        .attr({
                            'height': 30,
                            'width': 110,
                            'y': 210 + (count > 2 ? 30 : 0),
                            'x': rectIndeces[buffer],
                            'fill': getColorForSentimentScore(data.topWords[count].sentimentScore),
                            'stroke': '#fff',
                            'stroke-width': 1,
                            'shape-rendering': 'crispEdges'
                        });

                    svg.append('text')
                        .attr({
                            'height': 30,
                            'width': 110,
                            'y': 230 + (count > 2 ? 30 : 0),
                            'x': rectIndeces[buffer] + (55),
                            'font-size': 12,
                            'text-anchor': 'middle',
                            'fill': '#fff',
                            'xml:space': 'preserve',
                            'style': 'font-family:\'Helvetica\'; font-weight: 600;',
                            'text-rendering' : 'optimizeLegibility',
                            'font-weight' : 600
                        })
                        .text(data.topWords[count].word);
                }
            }

            // Sentiment Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'text-anchor': 'middle',
                    'y': 115,
                    'x': width / 2,
                    'fill': '#000000',
                    'xml:space': 'preserve',
                    'font-weight' : 600,
                    'style': 'font-family:\'Helvetica\'; font-weight: 600;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text('Sentiment Breakdown');

            // Sentiment Score Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-weight' : 600,
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': (width / 2) - 150,
                    'fill': '#000000',
                    'xml:space': 'preserve',
                    'style': 'font-family:\'Helvetica\'; font-weight: 600;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text('Sentiment Score');

            const score = (2 * ((data.positivePercentage * 0.3) + (data.neutralPercentage * 0.20) + (data.negativePercentage * 0.20))) + ((data.avgRatings / 5) * 30);
            const gradeColor = getGradeAndColorForScore(score);

            // Reviews Value
            svg.append('text')
                .attr({
                    'font-size': 40,
                    'text-anchor': 'middle',
                    'y': 80,
                    'x': (width / 2) - 150,
                    'fill': gradeColor.color,
                    'xml:space': 'preserve',
                    'style': 'font-family:\'Helvetica\'; font-weight: 100;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text(gradeColor.grade);

            // Reviews Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': width / 2,
                    'fill': '#000000',
                    'xml:space': 'preserve',
                    'style': 'font-family:\'Helvetica\'; font-weight: 600;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text('Reviews');

            // Reviews Value
            svg.append('text')
                .attr({
                    'font-size': 40,
                    'text-anchor': 'middle',
                    'y': 80,
                    'x': width / 2,
                    'fill': '#000',
                    'xml:space': 'preserve',
                    'style': 'font-family:\'Helvetica\'; font-weight: 100;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text(reviewsScorecardData.countRatings);

            // Avg Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': (width / 2) + 150,
                    'fill': '#000',
                    'xml:space': 'preserve',
                    'style': 'font-family:\'Helvetica\'; font-weight: 600;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text('Avg Stars');


            // Avg Value
            svg.append('text')
                .attr({
                    'font-size': 40,
                    'text-anchor': 'middle',
                    'y': 80,
                    'x': (width / 2) + 150,
                    'fill': '#000',
                    'xml:space': 'preserve',
                    'style': 'font-family:\'Helvetica\'; font-weight: 100;',
                    'text-rendering' : 'optimizeLegibility'
                })
                .text(reviewsScorecardData.avgRatings);

            try {
                fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                callback(null, filename);
            } catch (err) {
                callback(err);
            }
        }
    });
};

function getGradeAndColorForScore(score) {
    let gradeColor = {};
    if (score <= 100 && score >= 80) {
        gradeColor.color = '#118730';

        if (score >= 95) {
            gradeColor.grade = 'A+';
        } else if (score < 95 && score > 85) {
            gradeColor.grade = 'A';
        } else if (score <= 85) {
            gradeColor.grade = 'A-';
        }
    } else if (score <= 80 && score >= 60) {
        gradeColor.color = '#118730';

        if (score >= 75) {
            gradeColor.grade = 'B+';
        } else if (score < 75 && score > 60) {
            gradeColor.grade = 'B';
        } else if (score <= 60) {
            gradeColor.grade = 'B-';
        }
    } else if (score <= 60 && score >= 30) {
        gradeColor.color = '#dd8a3a';

        if (score >= 55) {
            gradeColor.grade = 'C+';
        } else if (score < 55 && score > 40) {
            gradeColor.grade = 'C';
        } else if (score <= 40) {
            gradeColor.grade = 'C-';
        }
    } else if (score <= 30 && score >= 20) {
        gradeColor.color = '#dd8a3a';

        if (score >= 26) {
            gradeColor.grade = 'D+';
        } else if (score < 26 && score > 23) {
            gradeColor.grade = 'D';
        } else if (score <= 23) {
            gradeColor.grade = 'D-';
        }
    } else if (score <= 20 && score >= 10) {
        gradeColor.color = '#c62817';
        gradeColor.grade = 'E';
    } else if (score <= 10 && score >= 0) {
        gradeColor.color = '#c62817';
        gradeColor.grade = 'F';
    }

    return gradeColor;
}

function getColorForSentimentScore(sentimentScore) {
    switch (sentimentScore) {
        case 0:
            return '#dd8a3a';
        case 1:
            return '#118730';
        case -1:
            return '#c62817';
        default:
            return '#dd8a3a';
    }
}