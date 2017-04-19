'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    sqs = require('../controller/lib/sqs'),
    blacklistDB = require('../controller/db/blacklistDB'),
    statusDB = require('../controller/db/statusDB'),
    log = require('../handlers/logs'),
    async = require('async'),
    utilities = require('../handlers/utilities'),
    FEEDBACK_TYPE = 'bounce';

bounceHanding();

/**
 * Recursive function 
 * 
 * Fetch SES email status record from SQS  
 * Update the email blacklist if email is bounced 
 */
function bounceHanding() {
    async.waterfall([
        async.constant(FEEDBACK_TYPE),
        fetchEmailRequest,
        processEmailFeedback,
        saveResponse
    ], function(err, result) {
        if (err && !err.hasOwnProperty('status')) {
            log.enterErrorLog(1000, errSource, 'bounceHanding', 'Failed to get the sqs email information', 'Failed to fetch the sqs data from Amazon', err);
        }
        debug('fetchDataSQS err %j result %j', err, result);
        //process.nextTick(callback) which will defer the execution of the callback until the next pass around the event loop. 
        setTimeout(function() {
            process.nextTick(bounceHanding);
        }, 3000);
    });
}
/**
 * Callback for getting the request data from the Amazon SQS queue 
 *
 * @callback fetchEmailRequestCallback
 * @param {Object} err Getting request data from SQS    
 * @param {Object} data SQS request data
 */
/**
 * Fetch email matrix data from the SQS
 * 
 * @param {fetchEmailRequestCallback} callback - A callback to SQS email sent status details
 */
function fetchEmailRequest(emailType, callback) {
    sqs.message(emailType, function(err, data) {
        return callback(err, data);
    });
}
/**
 * Callback for identifying the email bounce status
 *
 * @callback processEmailFeedbackCallback
 * @param {Object} err SQS request error object
 * @param {String} type Email response status type
 */
/**
 * Process the SQS email matrix status
 * 
 * @param {Object} data SES email matrix data  
 * @param {processEmailFeedbackTypeCallback} callback - A callback to email process status type
 */
function processEmailFeedback(data, callback) {
    if (!data.hasOwnProperty('status') && !data.status) {
        return callback({ status: false, message: 'Unable to process the SQS email status data' });
    }
    var processData = {
        messageId: data.mail.messageId,
        response: data.bounce,
        status: data.notificationType,
        email: utilities.extractor(data.mail.destination[0])
    }
    return callback(null, processData);
}
/**
 * Callback for updating the status email / Adding to the blacklist
 *
 * @callback saveResponseCallback
 * @param {Object} err MongoDB error object stacks 
 * @param {Object} data Determines status of the update / add it to blacklist if it is bounced
 */
/**
 * Update the status of the email and added it to the blacklist 
 * 
 * @param {Object} emailFeedback Email delivery status   
 * @param {saveResponseCallback} callback - A callback to MongoDB update database / insert to blacklist
 */
function saveResponse(emailFeedback, callback) {
    statusDB.updateEmailStatus(emailFeedback, function(err, status) {
        debug('updateEmailStatus err : %j result : %j', err, status);
        if (err) {
            log.enterErrorLog(1001, errSource, 'saveResponse', 'Failed to update the mongo email information', 'Failed to update the collection to mongo', err);
            return callback(err, null);
        }
        blacklistDB.saveEmailBlacklist(emailFeedback.email, FEEDBACK_TYPE, function(err, status) {
            if (err) {
                log.enterErrorLog(1002, errSource, 'saveEmailStatusRecord', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
                return callback(err, null);
            }
            return callback(null, status);
        });
    });
}