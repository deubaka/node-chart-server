import fs from 'fs';
import pnFs from 'pn/fs';
import path from 'path';
import uuid from 'node-uuid';
import AWS from 'aws-sdk';
import gm from 'gm';
import util from 'util';
import svg2png from 'svg2png';
import Config from '../res/config';

const credentials = new AWS.SharedIniFileCredentials({profile: Config.AWS_PROFILE});
AWS.config.credentials = credentials;

export default {
    uploadChart(filepath, convert, callback) {
        console.log(`filepath: ${filepath}`);

        // TODO Externalize conversion and option for image type
        if (convert && convert === true) {
            console.log('uploading converted svg');
            const pngFilename = `${uuid.v4()}.png`;
            console.log(`filename: ${pngFilename}`);
            const pngFilepath = path.join(__dirname, '..', '..', 'gen', pngFilename);
            gm(filepath)
                .density(100, 100)
                .quality(75)
                .resize(null, 400)
                .write(pngFilepath, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log(`image converted, ${pngFilepath}`);

                    const body = fs.createReadStream(pngFilepath);
                    const s3obj = new AWS.S3({
                        params: {
                            Bucket: Config.CHARTS_BUCKET,
                            Key: `charts/${pngFilename}`
                        }
                    });

                    s3obj.upload({Body: body}).on('httpUploadProgress', evt => {
                        console.log(`httpUploadProgress: ${evt}`);
                    }).send((err, data) => {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, data.Location);
                        }
                        console.log(util.inspect(data));

                        fs.unlink(filepath, err => {
                            if (!err) {
                                console.log(`Deleted ${filepath}`);
                            }
                        });
                        fs.unlink(pngFilepath, err => {
                            if (!err) {
                                console.log(`Deleted ${pngFilepath}`);
                            }
                        });
                    });
                });
        } else {
            const pngFilename = `${uuid.v4()}.png`;
            console.log(`filename: ${pngFilename}`);
            const pngFilepath = path.join(__dirname, '..', '..', 'gen', pngFilename);

            pnFs.readFile(filepath)
                .then(svg2png)
                .then(buffer => pnFs.writeFile(pngFilepath, buffer))
                .then(() => {
                    const body = fs.createReadStream(pngFilepath);
                    const s3obj = new AWS.S3({
                        params: {
                            Bucket: Config.CHARTS_BUCKET,
                            Key: `charts/${pngFilename}`
                        }
                    });

                    s3obj.upload({Body: body}).on('httpUploadProgress', evt => {
                        console.log(`httpUploadProgress: ${evt}`);
                    }).send((err, data) => {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, data.Location);
                        }
                        console.log(util.inspect(data));

                        fs.unlink(filepath, err => {
                            if (!err) {
                                console.log(`Deleted ${filepath}`);
                            }
                        });

                        fs.unlink(pngFilepath, err => {
                            if (!err) {
                                console.log(`Deleted ${pngFilepath}`);
                            }
                        });
                    });
                })
                .catch(e => console.error(e));
        }
    }
};