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
            }, height = 320, width = 400;

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
                    'height': height - margin.bottom - margin.top - 25,
                    'width': width - margin.right - margin.left,
                    'y': margin.top,
                    'x': margin.left,
                    'fill': '#ffffff',
                    'shape-rendering': 'crispEdges',
                    'rx': 4,
                    'ry': 4
                });

            const maxSentimentBar = width - (3 * margin.left) - (3 * margin.right);
            const positiveWidth = Math.ceil((data.positivePercentage / 100) * maxSentimentBar);
            const neutralWidth = Math.ceil((data.neutralPercentage / 100) * maxSentimentBar);
            const negativeWidth = Math.ceil((data.negativePercentage / 100) * maxSentimentBar);

            // Positive
            const positiveX = (width - maxSentimentBar) / 2;
            svg.append('rect')
                .attr({
                    'stroke': '#ffffff',
                    'stroke-width': 0,
                    'height': 30,
                    'width': positiveWidth,
                    'y': 108,
                    'x': positiveX,
                    'fill': '#2ecc82',
                    'shape-rendering': 'crispEdges',
                });

            // const positiveTextX = (positiveX + positiveWidth) / 2;
            // svg.append('text')
            //     .attr({
            //         'transform' : 'matrix(0.46277010440826416,0,0,0.46277010440826416,84.73962181247771,127.59210020303726) ',
            //         'font-size' : 24,
            //         'font-family' : 'Sans-serif',
            //         'text-anchor': 'middle',
            //         'y' : '-1',
            //         'x' : positiveTextX,
            //         'stroke-width' : 0,
            //         'xml:space' : 'preserve',
            //         'fill' : '#ffffff'
            //     })
            //     .text(`${data.positivePercentage}% :)`);

            // Neutral
            const neutralX = positiveX + positiveWidth + 1;
            svg.append('rect')
                .attr({
                    'stroke': '#ffffff',
                    'stroke-width': 0,
                    'height': 30,
                    'width': neutralWidth,
                    'y': 108,
                    'x': neutralX,
                    'fill': '#FC984E',
                    'shape-rendering': 'crispEdges'
                });

            // const neutralTextX = (neutralWidth + neutralX) + positiveX;
            // svg.append('text')
            //     .attr({
            //         'transform' : 'matrix(0.46277010440826416,0,0,0.46277010440826416,84.73962181247771,127.59210020303726) ',
            //         'font-size' : 24,
            //         'font-family' : 'Sans-serif',
            //         'text-anchor': 'middle',
            //         'y' : -1,
            //         'x' : neutralTextX,
            //         'stroke-width' : 0,
            //         'fill' : '#ffffff'
            //     })
            //     .text(`${data.neutralPercentage}% :|`);

            // Negative
            const negativeX = neutralX + neutralWidth + 1;
            svg.append('rect')
                .attr({
                    'stroke': '#ffffff',
                    'stroke-width': 0,
                    'height': 30,
                    'width': negativeWidth,
                    'y': 108,
                    'x': negativeX,
                    'fill': '#fc5e4e',
                    'shape-rendering': 'crispEdges'
                });

            // const negativeTextX = (negativeWidth + negativeX) + neutralX;
            // svg.append('text')
            //     .attr({
            //         'transform' : 'matrix(0.46277010440826416,0,0,0.46277010440826416,84.73962181247771,127.59210020303726) ',
            //         'font-size' : 24,
            //         'font-family' : 'Sans-serif',
            //         'text-anchor': 'middle',
            //         'y' : -1,
            //         'x' : negativeTextX,
            //         'stroke-width' : 0,
            //         'fill' : '#ffffff'
            //     })
            //     .text(`${data.negativePercentage}% :(`);

            // Others Comment
            svg.append('rect')
                .attr({
                    'stroke': '#efeded',
                    'stroke-width': 1,
                    'height': 115,
                    'width': width - (3 * margin.left) - (3 * margin.right),
                    'y': 150,
                    'x': positiveX,
                    'fill': '#f9f9f9',
                    'rx': 4,
                    'ry': 4,
                    'shape-rendering': 'crispEdges'
                });

            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 175,
                    'x': positiveX + 35,
                    'fill': '#7f7f7f'
                })
                .text('Version');

            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 175,
                    'x': positiveX + 115,
                    'fill': '#4c4c4c'
                })
                .text(data.topVersion);

            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 210,
                    'x': positiveX + 45,
                    'fill': '#7f7f7f'
                })
                .text('Top Words');

            const rectIndeces = [];
            if (data.hasOwnProperty('topWords') && data.topWords instanceof Array) {
                for (var count = 0; count < data.topWords.length; count++) {
                    // Others Comment
                    rectIndeces[count] = positiveX + (110 * count) + (count === 0 ? 10 : 0)
                    svg.append('rect')
                        .attr({
                            'stroke': '#efeded',
                            'stroke-width': 1,
                            'height': 30,
                            'width': 110,
                            'y': 225,
                            'x': rectIndeces[count],
                            'fill': '#f9f9f9',
                            'shape-rendering': 'crispEdges'
                        });

                    svg.append('text')
                        .attr({
                            'height': 30,
                            'width': 110,
                            'y': 245,
                            'x': rectIndeces[count] + (55),
                            'font-size': 12,
                            'font-family': 'Sans-serif',
                            'text-anchor': 'middle',
                            'fill': '#4c4c4c'
                        })
                        .text(data.topWords[count]);
                }
            }

            // Sentiment Label
            svg.append('text')
                .attr({
                    'font-size': 14,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 100,
                    'x': width / 2,
                    'fill': '#7f7f7f',
                    'xml:space': 'preserve'
                })
                .text('Sentiment Breakdown');

            // Sentiment Score Label
            svg.append('text')
                .attr({
                    'font-size': 14,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': (width / 2) - 100,
                    'fill': '#7F7F7F',
                    'xml:space': 'preserve'
                })
                .text('Sentiment Score');

            const gradeColor = getGradeAndColorForPercentage(data.positivePercentage);

            // Reviews Value
            svg.append('text')
                .attr({
                    'font-size': 22,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': (width / 2) - 100,
                    'fill': gradeColor.color,
                    'xml:space': 'preserve'
                })
                .text(gradeColor.grade);

            // Reviews Label
            svg.append('text')
                .attr({
                    'font-size': 14,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': width / 2,
                    'fill': '#7F7F7F',
                    'xml:space': 'preserve'
                })
                .text('Reviews');

            // Reviews Value
            svg.append('text')
                .attr({
                    'font-size': 22,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': width / 2,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve'
                })
                .text(reviewsScorecardData.countRatings);

            // Avg Label
            svg.append('text')
                .attr({
                    'font-size': 14,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': (width / 2) + 100,
                    'fill': '#7F7F7F',
                    'xml:space': 'preserve'
                })
                .text('Avg Stars');


            // Avg Value
            svg.append('text')
                .attr({
                    'font-size': 22,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': (width / 2) + 100,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve'
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

function getGradeAndColorForPercentage(percentage) {
    let gradeColor = {};
    if (percentage <= 100 && percentage >= 80) {
        gradeColor.color = '#2ecc82';

        if (percentage >= 95) {
            gradeColor.grade = 'A+';
        } else if (percentage < 95 && percentage > 85) {
            gradeColor.grade = 'A';
        } else if (percentage <= 85) {
            gradeColor.grade = 'A-';
        }
    } else if (percentage <= 80 && percentage >= 50) {
        gradeColor.color = '#2ecc82';

        if (percentage >= 75) {
            gradeColor.grade = 'B+';
        } else if (percentage < 75 && percentage > 60) {
            gradeColor.grade = 'B';
        } else if (percentage <= 60) {
            gradeColor.grade = 'B-';
        }
    } else if (percentage <= 60 && percentage >= 30) {
        gradeColor.color = '#FC984E';

        if (percentage >= 55) {
            gradeColor.grade = 'C+';
        } else if (percentage < 55 && percentage > 40) {
            gradeColor.grade = 'C';
        } else if (percentage <= 40) {
            gradeColor.grade = 'C-';
        }
    } else if (percentage <= 30 && percentage >= 20) {
        gradeColor.color = '#FC984E';

        if (percentage >= 26) {
            gradeColor.grade = 'D+';
        } else if (percentage < 26 && percentage > 23) {
            gradeColor.grade = 'D';
        } else if (percentage <= 23) {
            gradeColor.grade = 'D-';
        }
    } else if (percentage <= 20 && percentage >= 10) {
        gradeColor.color = '#fc5e4e';
        gradeColor.grade = 'E';
    } else if (percentage <= 10 && percentage >= 0) {
        gradeColor.color = '#fc5e4e';
        gradeColor.grade = 'F';
    }

    return gradeColor;
}