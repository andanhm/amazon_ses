'use strict';
var Mailer = require('./lib/mailer'),
  mailer = new Mailer();
/**
 * Ideally should return '{}' for Amazon-SES-health-check
 * 
 * @api public
 * @method
 * @param  {Object} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers
 * @param  {Object} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function send(req, res) {
  var data = {
    email: 'andan@gmail.com',
    subject: 'Test message',
    message: 'Hi how are you'
  }
  mailer.processEmail(data, function (error, response) {
    return res.status(200).type('json').send({
      error: error,
      data: response
    });
  });
}
module.exports = {
  send: send
}