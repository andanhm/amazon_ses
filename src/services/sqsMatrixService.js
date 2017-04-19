'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    sqs = require('../controller/lib/sqs'),
    log = require('../handlers/logs'),
    async = require('async');

fetchDataSQS();

/**
 * Recursive function 
 * 
 * Fetch ses email status records in a batch of 2000 from primary database 
 * Adds ses email status records to the secondary database (Archival data store)
 * Delete the ses email status records from the primary database 
 * Note: Emits an event when their is no record found and returns from the function
 * 
 * @param  {String} date Email status to be fetched by dates 
 */
function fetchDataSQS() {
    async.waterfall([
        fetchEmailRequest,
        processEmailFeedbackType,
        saveResponse
    ], function(err, result) {
        if (err) {
            log.enterErrorLog(7000, errSource, 'fetchDataSQS', 'Failed to get the sqs email information', 'Failed to fetch the sqs data from Amazon', err);
            return;
        }
        debug('fetchDataSQS err %j result %j', err, result);
        //process.nextTick(callback) which will defer the execution of the callback until the next pass around the event loop. 
        process.nextTick(fetchDataSQS);
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
function fetchEmailRequest(callback) {
    sqs.message(function(err, data) {
        return callback(err, data);
    });
}
/**
 * Callback for identifying the email delivery status
 *
 * @callback processEmailFeedbackTypeCallback
 * @param {Object} err SQS request error object
 * @param {String} type Email response status type
 */
/**
 * Process the SQS email matrix status
 * 
 * @param {Object} docs SES email matrix data  
 * @param {processEmailFeedbackTypeCallback} callback - A callback to email process status type
 */
function processEmailFeedbackType(docs, callback) {
    return callback({}, {});
}
/**
 * Callback for save the status email delivery
 *
 * @callback deleteEmailDataCallback
 * @param {Object} err MongoDB error object stacks 
 * @param {Object} data Determines status of the update / add it to blacklist if it is bounced
 */
/**
 * Update the status of the email delivery
 * 
 * @param {String} type Type of email delivery status  
 * @param {deleteEmailDataCallback} callback - A callback to MongoDB update database
 */
function saveResponse(type, callback) {
    return callback({}, {});
}