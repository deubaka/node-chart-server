const should = require('should');
const assert = require('assert');
const request = require('supertest');
import util from 'util';

describe('Charts', () => {
    const url = 'http://localhost:3000';
    let outputLogs = '';

    describe('GET Pie', () => {
        it('should return error trying to send empty data', (done) => {
            request(url)
                .get('/charts?type=chart.pie')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.body.success.should.equal(false);
                    res.body.result.should.equal('Incomplete params');

                    outputLogs += `\nGET Pie :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });

        it('should correctly generate chart', (done) => {
            const data = JSON.stringify([
                {
                    "label": "South Korea", "val": 2290
                },
                {
                    "label": "United States", "val": 4330
                },
                {
                    "label": "Others", "val": 5000
                },
                {
                    "label": "Philippines", "val": 1236
                },
                {
                    "label": "Malaysia", "val": 5230
                },
                {
                    "label": "Indonesia", "val": 8020
                },
                {
                    "label": "Singapore", "val": 3010
                }
            ])
            const params = `?type=chart.pie&data=${data}`;

            request(url)
                .get(`/charts${params}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }

                    res.body.success.should.equal(true);
                    res.body.result.should.not.equal(null);

                    outputLogs += `\nGET Pie :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });
    });

    describe('GET Donut', () => {
        it('should return error trying to send empty data', (done) => {
            request(url)
                .get('/charts?type=chart.donut')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.body.success.should.equal(false);
                    res.body.result.should.equal('Incomplete params');

                    outputLogs += `\nGET Donut :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });

        it('should correctly generate chart', (done) => {
            const data = JSON.stringify([
                {
                    "label": "South Korea", "val": 2290
                },
                {
                    "label": "United States", "val": 4330
                },
                {
                    "label": "Others", "val": 5000
                },
                {
                    "label": "Philippines", "val": 1236
                },
                {
                    "label": "Malaysia", "val": 5230
                },
                {
                    "label": "Indonesia", "val": 8020
                },
                {
                    "label": "Singapore", "val": 3010
                }
            ])
            const params = `?type=chart.donut&data=${data}`;

            request(url)
                .get(`/charts${params}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }

                    res.body.success.should.equal(true);
                    res.body.result.should.not.equal(null);

                    outputLogs += `\nGET Donut :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });
    });
    describe('GET Vertical Bar', () => {
        it('should return error trying to send empty data', (done) => {
            request(url)
                .get('/charts?type=chart.bar-simple-v')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.body.success.should.equal(false);
                    res.body.result.should.equal('Incomplete params');

                    outputLogs += `\nGET Vertical Bar :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });

        it('should correctly generate chart', (done) => {
            const data = JSON.stringify([
                {
                    "label": "South Korea", "hits": 2290
                },
                {
                    "label": "United States", "hits": 4330
                },
                {
                    "label": "Others", "hits": 5000
                },
                {
                    "label": "Philippines", "hits": 1236
                },
                {
                    "label": "Malaysia", "hits": 5230
                },
                {
                    "label": "Indonesia", "hits": 8020
                },
                {
                    "label": "Singapore", "hits": 3010
                }
            ])
            const params = `?type=chart.bar-simple-v&data=${data}`;

            request(url)
                .get(`/charts${params}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }

                    res.body.success.should.equal(true);
                    res.body.result.should.not.equal(null);

                    outputLogs += `\nGET Vertical Bar :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });
    });


    describe('GET Horizontal Bar', () => {
        it('should return error trying to send empty data', (done) => {
            request(url)
                .get('/charts?type=chart.bar-simple-h')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.body.success.should.equal(false);
                    res.body.result.should.equal('Incomplete params');
                    
                    outputLogs += `\nGET Horizontal Bar :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });

        it('should correctly generate chart', (done) => {
            const data = JSON.stringify([
                {
                    "label": "South Korea", "hits": 2290
                },
                {
                    "label": "United States", "hits": 4330
                },
                {
                    "label": "Others", "hits": 5000
                },
                {
                    "label": "Philippines", "hits": 1236
                },
                {
                    "label": "Malaysia", "hits": 5230
                },
                {
                    "label": "Indonesia", "hits": 8020
                },
                {
                    "label": "Singapore", "hits": 3010
                }
            ])
            const params = `?type=chart.bar-simple-h&data=${data}`;

            request(url)
                .get(`/charts${params}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }

                    res.body.success.should.equal(true);
                    res.body.result.should.not.equal(null);

                    outputLogs += `\nGET Horizontal Bar :: res.body: ${util.inspect(res.body)}`;
                    done();
                });
        });
    });
    
    after((done) => {
        console.log(`Output Logs: ${outputLogs}`);
        done();
    });
});