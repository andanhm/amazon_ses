'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('email:' + errSource),
    log = require('../../handlers/logs.js'),
    EmailStatus = require('../../models/status').EmailStatus;

/**
 * Callback for getting the MongoDB save status
 * @callback saveEmailStatusRecordCallback
 * @param {Object} err Returns mongo save error status details
 * @param {Object} messageId Returns the messageId  
 */
/**
 * Insert email status record to the email status collection
 * 
 * @param  {Object} emailRequestObject  Email request object
 * @param  {saveEmailStatusRecordCallback} callback - A callback to save email request
 */
function saveEmailStatusRecord(emailRequestObject, callback) {
    var emailStatus = new EmailStatus({
        body: emailRequestObject.message,
        subject: emailRequestObject.subject,
        from: emailRequestObject.from,
        to: emailRequestObject.to,
        bcc: emailRequestObject.bcc,
        response: emailRequestObject.response,
        messageId: emailRequestObject.messageId,
        requestStamp: emailRequestObject.requestStamp,
        attachment: emailRequestObject.attachment,
        status: emailRequestObject.status
    });
    // Call the built-in save method to save to the database
    emailStatus.save(function(err, result) {
        debug('saveEmailStatusRecord err : %j result : %j', err, result);
        if (err) {
            log.enterErrorLog(6010, errSource, 'saveEmailStatusRecord', 'Failed to set the mongo email information', 'Failed to set the collection to mongo', err);
            return callback(err, null);
        }
        return callback(null, result);
    });
}
/**
 * Callback for getting the MongoDB save status
 * 
 * @callback getEmailRequestObject
 * @param {Object} err Returns queue send error status details
 * @param {Array<Object>} result Returns the email collection details
 */
/**
 * Fetches email status record from MongoDB collection
 * 
 * @param  {getEmailRequestObjectCallback} callback - A callback to fetching mongo collection
 */
function getEmailRequestObject(callback) {
    EmailStatus.find({}, { _id: 0, __v: 0 }, function(err, result) {
        debug('getEmailRequestObject err : %j result : %j', err, result);
        if (err) {
            log.enterErrorLog(6010, errSource, 'getEmailRequestObject', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        return callback(null, result);
    });
}
module.exports = {
    saveEmailStatusRecord: saveEmailStatusRecord,
    getEmailRequestObject: getEmailRequestObject
}