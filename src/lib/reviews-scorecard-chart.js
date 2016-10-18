import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';

export default (reviewsScorecardData, callback) => {
    if (!reviewsScorecardData) {
        return callback(new Error('No data to work on'));
    }

    const css = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'stylesheets', 'review-scorecard.css'), 'utf-8');

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
            }, height = 250, width = 500;

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

            svg.append('style').html(css);

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
                        'y': 108,
                        'x': positiveX,
                        'fill': '#2ecc82',
                        'shape-rendering': 'crispEdges',
                    });
            }

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
            if (data.neutralPercentage > 0) {
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
            }

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
            if (data.negativePercentage > 0) {
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
            }

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

            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 160,
                    'x': width / 2,
                    'fill': '#7F7F7F',
                    'xml:space': 'preserve',
                    'class' :'light'
                })
                .text(data.topVersion);

            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 190,
                    'x': width / 2,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve',
                    'class' :'bold'
                })
                .text('Top Keywords');

            const rectIndeces = [];
            if (data.hasOwnProperty('topWords') && data.topWords instanceof Array) {
                for (var count = 0; count < data.topWords.length; count++) {
                    // Others Comment
                    rectIndeces[count] = ((width - (110 * data.topWords.length)) / 2) + (110 * count) + (count === 0 ? 10 : 0)
                    svg.append('rect')
                        .attr({
                            'height': 30,
                            'width': 110,
                            'y': 200,
                            'x': rectIndeces[count],
                            'fill' : getColorForSentimentScore(data.topWords[count].sentimentScore),
                            'stroke' : '#fff',
                            'stroke-width' : 1,
                            'shape-rendering': 'crispEdges'
                        });

                    svg.append('text')
                        .attr({
                            'height': 30,
                            'width': 110,
                            'y': 220,
                            'x': rectIndeces[count] + (55),
                            'font-size': 12,
                            'font-family': 'Sans-serif',
                            'text-anchor': 'middle',
                            'fill': '#fff',
                            'xml:space': 'preserve',
                            'class' :'bold'
                        })
                        .text(data.topWords[count].word);
                }
            }

            // Sentiment Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 100,
                    'x': width / 2,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve',
                    'class' :'bold'
                })
                .text('Sentiment Breakdown');

            // Sentiment Score Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': (width / 2) - 150,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve',
                    'class' :'bold'
                })
                .text('Sentiment Score');

            const score = (2 * ((data.positivePercentage * 0.3) + (data.neutralPercentage * 0.20) + (data.negativePercentage * 0.20))) + ((data.avgRatings / 5) * 30);
            const gradeColor = getGradeAndColorForScore(score);

            // Reviews Value
            svg.append('text')
                .attr({
                    'font-size': 22,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': (width / 2) - 150,
                    'fill': gradeColor.color,
                    'xml:space': 'preserve',
                    'class' :'light'
                })
                .text(gradeColor.grade);

            // Reviews Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': width / 2,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve',
                    'class' :'bold'
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
                    'fill': '#7F7F7F',
                    'xml:space': 'preserve',
                    'class' :'light'
                })
                .text(reviewsScorecardData.countRatings);

            // Avg Label
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 40,
                    'x': (width / 2) + 150,
                    'fill': '#4c4c4c',
                    'xml:space': 'preserve',
                    'class' :'bold'
                })
                .text('Avg Stars');


            // Avg Value
            svg.append('text')
                .attr({
                    'font-size': 22,
                    'font-family': 'Sans-serif',
                    'text-anchor': 'middle',
                    'y': 65,
                    'x': (width / 2) + 150,
                    'fill': '#7F7F7F',
                    'xml:space': 'preserve',
                    'class' :'light'
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
        gradeColor.color = '#2ecc82';

        if (score >= 95) {
            gradeColor.grade = 'A+';
        } else if (score < 95 && score > 85) {
            gradeColor.grade = 'A';
        } else if (score <= 85) {
            gradeColor.grade = 'A-';
        }
    } else if (score <= 80 && score >= 60) {
        gradeColor.color = '#2ecc82';

        if (score >= 75) {
            gradeColor.grade = 'B+';
        } else if (score < 75 && score > 60) {
            gradeColor.grade = 'B';
        } else if (score <= 60) {
            gradeColor.grade = 'B-';
        }
    } else if (score <= 60 && score >= 30) {
        gradeColor.color = '#FC984E';

        if (score >= 55) {
            gradeColor.grade = 'C+';
        } else if (score < 55 && score > 40) {
            gradeColor.grade = 'C';
        } else if (score <= 40) {
            gradeColor.grade = 'C-';
        }
    } else if (score <= 30 && score >= 20) {
        gradeColor.color = '#FC984E';

        if (score >= 26) {
            gradeColor.grade = 'D+';
        } else if (score < 26 && score > 23) {
            gradeColor.grade = 'D';
        } else if (score <= 23) {
            gradeColor.grade = 'D-';
        }
    } else if (score <= 20 && score >= 10) {
        gradeColor.color = '#fc5e4e';
        gradeColor.grade = 'E';
    } else if (score <= 10 && score >= 0) {
        gradeColor.color = '#fc5e4e';
        gradeColor.grade = 'F';
    }

    return gradeColor;
}

function getColorForSentimentScore(sentimentScore) {
    switch (sentimentScore) {
        case 0:
            return '#FC984E';
        case 1:
            return '#2ecc82';
        case -1:
            return '#fc5e4e';
        default:
            return '#FC984E';
    }
}