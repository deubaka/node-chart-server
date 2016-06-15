var util = require('util');
var d3 = require('d3');
var path = require('path');
var chartFactory = require('../lib/chart-factory');
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
                    // res.setHeader('Content-Type', 'image/svg+xml');
                    res.sendFile(path.join(__dirname, '../gen', chartLocation));

                }
            });
        }
    } else {
        res.send({success: false, result: 'Incomplete params'});
    }


});

module.exports = router;
