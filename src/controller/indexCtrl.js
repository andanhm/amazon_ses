'use strict';

/**
 * Ideally should return '{}' for Amazon-SES-health-check
 * 
 * @api public
 * @method
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Object} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function checkHealth(req, res) {
  return res.status(200).type('json').send({
    error: {},
    data: {
      status: true,
      message: 'Application running'
    }
  });
}
module.exports = {
  checkHealth: checkHealth
}