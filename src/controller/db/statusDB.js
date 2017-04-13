'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('email:' + errSource),
    log = require('../../handlers/logs.js'),
    EmailStatus = require('../../models/status').EmailStatus;

/**
 * Callback for getting the MongoDB save status
 * @callback pushInToQueueCallback
 * @param {Object} err Returns queue send error status details
 * @param {Object} queueStatusWithMessageId Returns the userId with queued status details
 */
/**
 * Insert email status record to the email status collection
 * 
 * @param  {Object} emailRequestObject  Email request object
 * @param  {saveEmailStatusRecordCallback} callback - A callback to queue send status
 */
function saveEmailStatusRecord(emailRequestObject, callback) {
    var emailStatus = new EmailStatus({
        body: emailRequestObject.body,
        subject: emailRequestObject,
        fromEmail: emailRequestObject,
        fromName: emailRequestObject,
        toEmail: emailRequestObject,
        toName: emailRequestObject,
        bcc: emailRequestObject,
        tid: emailRequestObject,
        response: {},
        msgid: emailRequestObject.msgid,
        attachment: emailRequestObject.attachment
    });
    // Call the built-in save method to save to the database
    emailStatus.save(function(err, result) {
        debug('saveEmailStatusRecord err : %j result : %j', err, result);
        if (err) {
            log.enterErrorLog(6010, errSource, 'saveEmailStatusRecord', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        return callback(null, result);
    });
}

module.exports = {
    saveEmailStatusRecord: saveEmailStatusRecord
}