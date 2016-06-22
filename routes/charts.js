var util = require('util');
var d3 = require('d3');
var path = require('path');
var chartFactory = require('../lib/chart-factory');
var s3Helper = require('../lib/s3-helper');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var params = req.query;

    if (params && params.type && params.data) {
        var type = params.type;
        var data = JSON.parse(params.data);
        if (params.debug) {
            chartFactory.createChartFor(type, data, function (err, chartLocation) {
                if (err) {
                    res.send({success: false, result: err.message});
                } else {
                    res.render('charts-debug', {
                        params: util.inspect(req.query),
                        chartSrc: chartLocation
                    });
                }
            });

        } else {
            chartFactory.createChartFor(type, data, function (err, chartLocation) {
                if (err) {
                    res.send({success: false, result: err.message});
                } else {
                    s3Helper.uploadChart(path.join(__dirname, '../gen', chartLocation), function (err, s3Location) {
                        if (err) {
                            res.send({success: false, result: err.message});
                        } else {
                            res.send({success: true, result: s3Location});
                        }
                    });
                }
            });
        }
    } else {
        res.send({success: false, result: 'Incomplete params'});
    }


});

module.exports = router;
