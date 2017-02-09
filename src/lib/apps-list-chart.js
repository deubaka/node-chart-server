import d3 from 'd3';
import jsdom from 'jsdom';
import path from 'path';
import fs from 'fs';

export default (appsListData, callback) => {
    if (!appsListData) {
        return callback(new Error('No data to work on'));
    }

    const filename = `apps-list_${new Date().getTime()}.svg`;
    const outputLocation = path.join(__dirname, '..', '..', 'gen', filename);
    jsdom.env({
        html: '',
        features: {QuerySelector: true},
        done(errors, window) {
            window.d3 = d3.select(window.document);

            const margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }, height = 300, width = 650;

            let svg = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg:svg')
                .attr({
                    xmlns: 'http://www.w3.org/2000/svg',
                    'xmlns:xlink' : 'http://www.w3.org/1999/xlink',
                    version: '1.1',
                    width: width,
                    height: height
                });

            svg = svg.append('g');

            // Apps Followed
            const appsFollowed = appsListData.apps_followed;
            // Title
            svg.append('text')
                .attr({
                    'font-size': 15,
                    'text-anchor': 'left',
                    'y': 20,
                    'x': 20,
                    'fill': '#1A1A1A',
                    'font-weight': 700,
                    'font-family': 'Helvetica',
                    'text-rendering': 'geometricPrecision'
                })
                .text('Apps Followed');

            svg = svg.append('g');

            // Loop through reviews max of 5?
            for (let index = 0; index < appsFollowed.length; index++) {
                const appFollowed = appsFollowed[index];

                // app icon
                svg.append('image')
                    .attr({
                        'y': (index * 25) + 35,
                        'x': 20,
                        'width' : 20,
                        'height' : 20
                    })
                    .attr('xlink:href', `./../public/images/ios-app-default.png`);

                // app name
                svg.append('text')
                    .attr({
                        'font-size': 13,
                        'text-anchor': 'left',
                        'y': (index * 25) + 50 ,
                        'x': 45,
                        'fill': '#000000',
                        'font-weight': 700,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(`${appFollowed.app_name}`);

                // app id and geo
                svg.append('text')
                    .attr({
                        'font-size': 10,
                        'text-anchor': 'left',
                        'y': (index * 25) + 50,
                        'x': 95,
                        'fill': '#000000',
                        'font-weight': 300,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text(`(${appFollowed.app_id} | ${appFollowed.geo})`);

                // Apps Integrated
                svg = svg.append('g');

                const appsIntegrated = appsListData.apps_integrated;
                // Title
                svg.append('text')
                    .attr({
                        'font-size': 15,
                        'text-anchor': 'left',
                        'y': 20,
                        'x': 280,
                        'fill': '#1A1A1A',
                        'font-weight': 700,
                        'font-family': 'Helvetica',
                        'text-rendering': 'geometricPrecision'
                    })
                    .text('Apps Integrated');

                svg = svg.append('g');
                // Loop through reviews max of 5?
                for (let index = 0; index < appsIntegrated.length; index++) {
                    const appIntegrated = appsIntegrated[index];

                    // app icon
                    svg.append('image')
                        .attr({
                            'y': (index * 25) + 35,
                            'x': 280,
                            'width': 20,
                            'height': 20
                        })
                        .attr('xlink:href', `./../public/images/ios-app-default.png`);

                    // app name
                    svg.append('text')
                        .attr({
                            'font-size': 13,
                            'text-anchor': 'left',
                            'y': (index * 25) + 50,
                            'x': 305,
                            'fill': '#000000',
                            'font-weight': 700,
                            'font-family': 'Helvetica',
                            'text-rendering': 'geometricPrecision'
                        })
                        .text(`${appIntegrated.app_name}`);

                    // app id and geo
                    svg.append('text')
                        .attr({
                            'font-size': 10,
                            'text-anchor': 'left',
                            'y': (index * 25) + 50,
                            'x': 355,
                            'fill': '#000000',
                            'font-weight': 300,
                            'font-family': 'Helvetica',
                            'text-rendering': 'geometricPrecision'
                        })
                        .text(`(${appIntegrated.app_id} | ${appIntegrated.geo})`);
                }
            }

            try {
                fs.writeFileSync(outputLocation, window.d3.select('.container').html());
                callback(null, filename);
            } catch (err) {
                callback(err);
            }
        }
    });
};