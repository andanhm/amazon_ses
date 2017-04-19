'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Require the dev-dependencies
var supertest = require('supertest'),
    should = require('should'), // eslint-disable-line
    express = require('../app'),
    app = {},
    server = {};
describe('Amazon SES Email API -- ', function() {

    before(function(next) {
        app = express.listen(function() {
            if (app.address().port) {
                next();
            }
        });
        server = supertest(app)
    });

    it('/GET Ideally status for Amazon SES application', function(done) { //API test to determine the app version
        server
            .get('/status')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.status.should.equal(200);
                done();
            });
    });

    it('/POST Send email without attachment', function(done) { //API test send a email without attachment
        server
            .post('/email')
            .send({
                'email': 'bounce@simulator.amazonses.com',
                'name': 'Amazon SES',
                'subject': 'Test SES email',
                'message': '<b>Welcome</b> <br/> Amazon ses demo project'
            })
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.status.should.equal(200);
                done();
            });
    });

    it('/GET List all the email request', function(done) { //API test check all the email request
        server
            .get('/email')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                res.status.should.equal(200);
                done();
            });
    });

    after(function() {
        // stop listening that port
        app.close();
    });

});