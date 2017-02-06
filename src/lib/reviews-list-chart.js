import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import fs from 'fs';

export default (reviewsListData, callback) => {
    if (!reviewsListData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `reviews-list_${new Date().getTime()}.svg`;
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);
            const data = reviewsListData.reviews;

            const margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }, height = data.data.length * 150, width = 500;

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

            // Title
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'text-anchor': 'left',
                    'y': 25,
                    'x': 30,
                    'fill': '#1A1A1A',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text(data.title || 'App Store Reviews');

            svg = svg.append('g');

            // Loop through reviews max of 5?
            for (let index = 0; index < data.data.length; index++) {
                const review = data.data[index];
                const offset = index * 5;

                // Date and geo
                svg.append('text')
                    .attr({
                        'font-size': 11,
                        'text-anchor': 'left',
                        'y': (index * 80) + 50 + offset,
                        'x': 30,
                        'fill': '#9EA0A4',
                        'font-weight': 300,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(`${review.date} from ${review.geo}`);

                svg.append('text')
                    .attr({
                        'font-size': 15,
                        'text-anchor': 'left',
                        'y': (index * 80) + 15 + 50 + offset,
                        'x': 30,
                        'fill': '#9EA0A4',
                        'font-weight': 300,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text('⭐⭐⭐');

                svg.append('text')
                    .attr({
                        'font-size': 13,
                        'text-anchor': 'left',
                        'y': (index * 80) + 30 + 50 + offset,
                        'x': 30,
                        'fill': '#3E83C8',
                        'font-weight': 700,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(review.title || 'Some generic title');

                svg.append('text')
                    .attr({
                        'font-size': 11,
                        'text-anchor': 'left',
                        'y': (index * 80) + 45 + 50 + offset,
                        'x': 30,
                        'fill': '#5D5D5D',
                        'font-weight': 300,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(review.title || 'Some generic title');

                svg.append('text')
                    .attr({
                        'font-size': 11,
                        'text-anchor': 'left',
                        'y': (index * 80) + 60 + 50 + offset,
                        'x': 30,
                        'fill': '#9EA0A4',
                        'font-weight': 300,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    }) //`${review.date} from ${review.geo}` ||
                    .text(`by ${review.name}`);

                try {
                    fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                    callback(null, filename);
                } catch (err) {
                    callback(err);
                }
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