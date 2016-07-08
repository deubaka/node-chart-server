import path from 'path';
import chartFactory from '../lib/chart-factory';
import s3Helper from '../lib/s3-helper';
import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
    const params = req.query;

    if (params && params.type && params.data) {
        const type = params.type;
        const data = JSON.parse(params.data);
        if (params.debug) {
            chartFactory.createChartFor(type, data, (err, chartLocation) => {
                if (err) {
                    res.status(500).json({success: false, result: err.message});
                } else {
                    res.status(200).json({success: true, result: chartLocation});
                }
            });
        } else {
            chartFactory.createChartFor(type, data, (err, chartLocation) => {
                if (err) {
                    res.status(500).json({success: false, result: err.message});
                } else {
                    s3Helper.uploadChart(path.join(__dirname, '..', '..', 'gen', chartLocation), (err, s3Location) => {
                        if (err) {
                            res.status(400).json({success: false, result: err.message});
                        } else {
                            res.status(200).json({success: true, result: s3Location});
                        }
                    });
                }
            });
        }
    } else {
        res.status(400).json({success: false, result: 'Incomplete params'});
    }
});

export default router;