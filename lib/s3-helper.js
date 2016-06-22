var fs = require("pn/fs");
var zlib = require('zlib');
var path = require('path');
var util = require('util');
var svg2png = require('svg2png');
var uuid = require('node-uuid');

var AWS = require('aws-sdk');
var Config = require('../res/config');

var credentials = new AWS.SharedIniFileCredentials({profile: Config.AWS_PROFILE});
AWS.config.credentials = credentials;

var s3 = new AWS.S3();
module.exports = {
    uploadChart: function (filepath, callback) {
        console.log('filepath: ' + filepath);

        // TODO Externalize conversion and option for image type
        fs.readFile(filepath)
            .then(svg2png)
            .then(function (buffer) {
                console.log('writing png...');
                var pngFilename = uuid.v4() + '.png';
                console.log('filename: ' + pngFilename);
                var pngFilepath = path.join(__dirname, '../gen', pngFilename);
                fs.writeFile(pngFilepath, buffer);

                var body = fs.createReadStream(pngFilepath);
                var s3obj = new AWS.S3({
                    params: {
                        Bucket: Config.CHARTS_BUCKET,
                        Key: 'charts/' + pngFilename
                    }
                });

                s3obj.upload({Body: body}).on('httpUploadProgress', function (evt) {
                    console.log('httpUploadProgress: ' + evt);
                }).send(function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data.Location);
                    }
                    console.log(util.inspect(data));

                    fs.unlink(filepath, function (err) {
                        if (!err) {
                            console.log('Deleted ' + filepath);
                        }
                    });
                    fs.unlink(pngFilepath, function (err) {
                        if (!err) {
                            console.log('Deleted ' + filepath);
                        }
                    });
                });
            })
            .catch(function (err) {
                console.error(err);
            });


    }
};