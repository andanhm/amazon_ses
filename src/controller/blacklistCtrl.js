'use strict';
var blacklistDB = require('./db/blacklistDB');
/**
 * Ideally should return '{Object}' of email blacklisted
 * 
 * @api public
 * @method
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Object} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function getBlacklisted(req, res) {
    blacklistDB.getBlacklist(function(error, response) {
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
function removeBlacklisted(req, res) {
    var email = req.params.email;
    if (!email) {
        return res.status(422).type('json').send({
            error: { message: 'Email address not passed' },
            data: {}
        });
    }
    blacklistDB.removeEmailFromBlacklist(email, function(error, response) {
        return res.status(200).type('json').send({
            error: error,
            data: response
        });
    });
}
module.exports = {
    getBlacklisted: getBlacklisted,
    removeBlacklisted: removeBlacklisted
}