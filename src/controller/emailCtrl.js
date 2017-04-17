'use strict';
var Mailer = require('./lib/mailer'),
    mailer = new Mailer();
/**
 * Ideally should return '{Object}' for email sent status
 * 
 * @api public
 * @method
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Object} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function send(req, res) {
    var data = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    }
    mailer.processEmail(data, function(error, response) {
        return res.status(200).type('json').send({
            error: error,
            data: response
        });
    });
}
/**
 * Ideally should return '{Object}' of email blacklisted
 * 
 * @api public
 * @method
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Object} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function getBlacklisted(req, res) {
    mailer.listEmailBlacklisted(function(error, response) {
        return res.status(200).type('json').send({
            error: error,
            data: response
        });
    });
}
module.exports = {
    send: send,
    getBlacklisted: getBlacklisted
}