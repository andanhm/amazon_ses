'use strict';
var url = require('url'),
    statusCodes = {
        '200': 'OK',
        '201': 'Created',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '404': 'Not Found',
        '406': 'Not Acceptable',
        '422': 'Unprocessable Entity',
        '500': 'Internal Server Error'
    };
/**
 * Gets the request url from the http express request param
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 */
function formatRequestUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
}
/**
 * Gets http status message based on the HTTP status code 
 * @param  {Number} statusCode HTTP status code
 */
function getStatusText(statusCode) {
    if (statusCodes.hasOwnProperty(statusCode)) {
        return statusCodes[statusCode];
    } else {
        throw new Error('Status code does not exist: ' + statusCode);
    }
}

/**
 * HTTP Response configuration with defined from Queue-Man 
 * 
 * Note: New Relic treats other then 200 as a error the change the status response status code as 200 in order to avoid 
 * 
 * @param  {Object} res The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Number} statusCode HTTP status code
 * @param  {Object} errorObject Response error body object that need to be responded
 * @param  {Object} dataObject Response body object that need to be responded
 */
function httpResponse(res, statusCode, errorObject, dataObject, apiName) {
    return res.status(statusCode).type('json').send({
        status: statusCode,
        error: errorObject ? errorObject : {},
        data: dataObject ? dataObject : {}
    });
}

module.exports = {
    formatRequestUrl: formatRequestUrl,
    httpResponse: httpResponse,
    getStatusText: getStatusText
};