'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('email:' + errSource),
    awsConfig = require('../../config/' + process.env.NODE_ENV).aws.ses, //Key can be set from environment variable or config.
    nodeMailer = require('nodemailer'),
    ses = require('nodemailer-ses-transport');

var transporter = nodeMailer.createTransport(ses(awsConfig));
/**
 * SESMailer
 * 
 * Main function of this file which is exported the object that will call functions from this library is scoped global
 */
function SESMailer() {}

/**
 * Callback for email processed details / error details  
 *
 * @callback sendEmailCallback
 * @param  {Object} error Return if any required object missing / Error sending email from SES
 * @param  {Object} result Acknowledges status of the message
 **/
/**
 * Composes an email message based on input data, and then immediately queues the message for sending.
 *
 * sendEmail receives an options object with the following properties (subject,message etc..):
 * 
 * // For reference to document: https://github.com/SparkPost/Nodemailer
 *  
 * @param {Object} options Information that need to set 
 * @param {String} options.from - Email address from which to send (required)
 * @param {String} options.subject - Email subject  (required). Must be encoded as UTF-8
 * @param {String} options.message - Can be html (required). Must be encoded as UTF-8.
 * @param {String} options.altText - Plain text version of message. Must be encoded as UTF-8.
 * @param {Array<String>} options.to - Email address or array of addresses
 * @param {Array<String>} options.cc - Email address or array of addresses
 * @param {Array<String>} options.bcc - Email address or array of addresses
 * @param {Array<Object>} options.attachments - Email with attachments
 * @param {String} options.replyTo - Email address
 * 
 * @param {sendEmailCallback} callback Callback for email processed details / error details 
 */
SESMailer.prototype.sendEmail = function(options, callback) {
    transporter.sendMail({
        from: options.from,
        to: options.to,
        html: options.message,
        text: options.message,
        subject: options.subject,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments
    }, function(err, emailResponse) {
        debug('ASW email err %s emailResponse %s', err, emailResponse);

        if (err) {
            return callback(err, null);
        }
        var responseMetadata = emailResponse ? {
            messageId: emailResponse.messageId.split('@')[0]
        } : emailResponse;
        return callback(null, responseMetadata);
    });
};

exports.createClient = function createClient() {
    return new SESMailer();
};