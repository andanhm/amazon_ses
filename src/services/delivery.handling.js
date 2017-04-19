'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    sqs = require('../controller/lib/sqs'),
    statusDB = require('../controller/db/statusDB'),
    log = require('../handlers/logs'),
    async = require('async'),
    utilities = require('../handlers/utilities'),
    FEEDBACK_TYPE = 'delivery';

deliveryHanding();

/**
 * Recursive function 
 * 
 * Fetch SES email status record from SQS  
 * Update the email delivery status
 */
function deliveryHanding() {
    async.waterfall([
        async.constant(FEEDBACK_TYPE),
        fetchEmailRequest,
        processEmailFeedback,
        saveResponse
    ], function(err, result) {
        if (err && !err.hasOwnProperty('status')) {
            log.enterErrorLog(3000, errSource, 'deliveryHanding', 'Failed to get the sqs email information', 'Failed to fetch the sqs data from Amazon', err);
        }
        debug('fetchDataSQS err %j result %j', err, result);
        //process.nextTick(callback) which will defer the execution of the callback until the next pass around the event loop. 
        setTimeout(function() {
            process.nextTick(deliveryHanding);
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
 * Callback for identifying the email delivery status
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
        response: data.delivery,
        status: data.notificationType,
        email: utilities.extractor(data.mail.destination[0])
    }
    return callback(null, processData);
}
/**
 * Callback for updating the delivery status of the email 
 *
 * @callback saveResponseCallback
 * @param {Object} err MongoDB error object stacks 
 * @param {Object} data Determines status of the update 
 */
/**
 * Update the status of the email and added it to the blacklist 
 * 
 * @param {Object} emailFeedback Email delivery status   
 * @param {saveResponseCallback} callback - A callback to MongoDB update database
 */
function saveResponse(emailFeedback, callback) {
    statusDB.updateEmailStatus(emailFeedback, function(err, status) {
        debug('updateEmailStatus err : %j result : %j', err, status);
        if (err) {
            log.enterErrorLog(3001, errSource, 'updateEmailStatus', 'Failed to update the mongo email information', 'Failed to update the collection to mongo', err);
            return callback(err, null);
        }
        return callback(null, status);
    });
}