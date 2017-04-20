'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    trackDB = require('./db/track.database'),
    fs = require('fs'),
    path = require('path'),
    querystring = require('querystring');
/**
 * Ideally should return 204
 * 
 * @api public
 * @method
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Object} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function trackEmail(req, res) {
    var params = querystring.parse(req._parsedUrl.query);
    var emailRequestId = params.requestID;
    console.log(req);
    trackDB.open(emailRequestId, function() {
        var imagePath = path.join(__dirname, '../', 'public', 'img', 'track.png');
        console.log(imagePath)
        return res.sendFile(imagePath);
    });
}
module.exports = {
    trackEmail: trackEmail
}