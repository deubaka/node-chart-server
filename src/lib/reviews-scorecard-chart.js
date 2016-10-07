import fs from 'fs';
import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import colors from '../res/color';

export default (reviewsScorecardData, callback) => {
    if (!reviewsScorecardData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `reviews-scorecard_${new Date().getTime()}.svg`;

    const css = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'stylesheets', 'reviews-scorecard.css'), 'utf-8');
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
            }, height = 250, width = 400;

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
            svg = svg.append('g');

            svg.append('rect')
                .attr({
                    'stroke' : '#e5e5e5',
                    'height' : 205,
                    'width' : 380,
                    'y': 10,
                    'x' : 10,
                    'fill' : '#ffffff',
                    'rx' : 4,
                    'ry' : 4
                });

            const maxSentimentBar = 117 * 3;
            const positiveWidth = (data.positivePercentage / 100) * maxSentimentBar;
            const neutralWidth = (data.neutralPercentage / 100) * maxSentimentBar;
            const negativeWidth = (data.negativePercentage / 100) * maxSentimentBar;

            // Positive
            const positiveX = 26;
            svg.append('rect')
                .attr({
                    'stroke' : '#ffffff',
                    'stroke-width' : 0,
                    'height' : 30,
                    'width' : positiveWidth,
                    'y': 108,
                    'x' : positiveX,
                    'fill' : '#2ecc82'
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
            const neutralX = positiveX + positiveWidth;
            svg.append('rect')
                .attr({
                    'stroke' : '#ffffff',
                    'stroke-width' : 0,
                    'height' : 30,
                    'width' : neutralWidth,
                    'y': 108,
                    'x' : neutralX,
                    'fill' : '#FC984E'
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
            const negativeX = neutralX + neutralWidth;
            svg.append('rect')
                .attr({
                    'stroke' : '#ffffff',
                    'stroke-width' : 0,
                    'height' : 30,
                    'width' : negativeWidth,
                    'y': 108,
                    'x' : negativeX,
                    'fill' : '#fc5e4e'
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

            // Top Comment
            svg.append('rect')
                .attr({
                    'stroke' : '#efeded',
                    'stroke-width' : 1,
                    'height' : 50,
                    'width' : 350,
                    'y': 150,
                    'x' : 26,
                    'fill' : '#f9f9f9',
                    'rx' : 4,
                    'ry' : 4
                });

            svg.append('text')
                .attr({
                    'font-size' : 12,
                    'font-family' : 'Sans-serif',
                    'text-anchor': 'left',
                    'y': 180,
                    'x' : 80,
                    'height' : 60,
                    'width' : 340,
                    'stroke' : '#e5e5e5',
                    'stroke-width' : 0,
                    'fill' : '#4c4c4c'
                })
                .text(data.topComment);

            // Sentiment Label
            svg.append('text')
                .attr({
                    'font-size' : 14,
                    'font-family' : 'Sans-serif',
                    'text-anchor': 'middle',
                    'y' : 100,
                    'x' : width / 2,
                    'stroke' : '#e5e5e5',
                    'stroke-width' : 0,
                    'fill' : '#7f7f7f',
                    'xml:space' : 'preserve'
                })
                .text('Sentiment Breakdown');


            // Reviews Label
            svg.append('text')
                .attr({
                    'font-size' : 22,
                    'font-family' : 'Sans-serif',
                    'text-anchor': 'middle',
                    'y' : 40,
                    'x' : width / 3,
                    'stroke' : '#7f7f7f',
                    'stroke-width' : 0,
                    'fill' : '#7f7f7f',
                    'xml:space' : 'preserve'
                })
                .text('Reviews');

            // Reviews Value
            svg.append('text')
                .attr({
                    'font-size' : 20,
                    'font-family' : 'Sans-serif',
                    'text-anchor': 'middle',
                    'y' : 65,
                    'x' : width / 3,
                    'stroke' : '#e5e5e5',
                    'stroke-width' : 0,
                    'fill' : '#4c4c4c',
                    'xml:space' : 'preserve'
                })
                .text(reviewsScorecardData.countRatings);

            // Avg Label
            svg.append('text')
                .attr({
                    'font-size' : 22,
                    'font-family' : 'Sans-serif',
                    'text-anchor': 'middle',
                    'y' : 40,
                    'x' : width * .67,
                    'stroke' : '#7F7F7F',
                    'stroke-width' : 0,
                    'fill' : '#7f7f7f',
                    'xml:space' : 'preserve'
                })
                .text('Avg Stars');


            // Avg Value
            svg.append('text')
                .attr({
                    'font-size' : 20,
                    'font-family' : 'Sans-serif',
                    'text-anchor': 'middle',
                    'y' : 65,
                    'x' : width * .67,
                    'stroke' : '#e5e5e5',
                    'stroke-width' : 0,
                    'fill' : '#4c4c4c',
                    'xml:space' : 'preserve'
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