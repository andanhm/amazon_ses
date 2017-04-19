'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    log = require('../../handlers/logs'),
    awsConfig = require('../../config/' + process.env.NODE_ENV), //Key can be set from environment variable or config.
    AWS = require('aws-sdk');
AWS.config.accessKeyId = awsConfig.aws.accessKeyId;
AWS.config.secretAccessKey = awsConfig.aws.secretAccessKey;
AWS.config.region = awsConfig.aws.region;

// Create an SQS service object
var sqs = new AWS.SQS({
    apiVersion: awsConfig.apiVersion
});

/**
 * Determines the SQS topic url from the configuration  
 * 
 * @param  {String} emailStatusType Email matrix/notification type
 */
function getQueueUrl(emailStatusType) {
    switch (emailStatusType) {
        case 'bounce':
            return awsConfig.sqs.bounce;
        case 'complaint':
            return awsConfig.sqs.complaint;
        case 'delivery':
            return awsConfig.sqs.delivery;
    }
}
/**
 * Fetches the massage from SQS based on the type (bounce,complaints,delivery)
 * 
 * @param  {String} emailStatusType Email matrix/notification type
 * @param  {Object} callback Returns the JSON data of the email status 
 */
function message(emailType, callback) {
    try {
        var params = {
            AttributeNames: [
                'SentTimestamp'
            ],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: [
                'All'
            ],
            QueueUrl: getQueueUrl(emailType),
            VisibilityTimeout: 0,
            WaitTimeSeconds: 0
        };
        sqs.receiveMessage(params, function(err, data) {
            if (err) {
                debug('Receive Error', err);
                return callback(err, null)
            } else {
                if (!data || !data.hasOwnProperty('Messages') || data.Messages.length <= 0) {
                    return callback({ status: false, message: 'No record found' }, null);
                }
                deleteMessage(params.QueueUrl, data.Messages[0].ReceiptHandle);
                var body = data.Messages[0].Body;
                var bodyMsg = JSON.parse(body);
                var result = JSON.parse(bodyMsg.Message);
                result.status = true;
                return callback(null, result);
            }
        });
    } catch (err) {
        log.enterErrorLog(8000, errSource, 'message', 'Unhandled exception', 'Something went wrong in SQS', err);
        return callback({ status: false, message: 'Unhandled exception' }, null);
    }

}
/**
 * Deletes the message from the Queue after consuming
 * @param  {String} url SQS Queue url 
 * @param  {Object} receiptHandle ReceiptHandle to identify with message to to deleted
 */
function deleteMessage(url, receiptHandle) {
    sqs.deleteMessage({
        QueueUrl: url,
        ReceiptHandle: receiptHandle
    }, function(err, data) {
        if (err) {
            log.enterErrorLog(8001, errSource, 'deleteMessage', 'Error will deleting from bounce Queue', 'SQS error queue', err);
            debug('Error will deleting from bounce Queue', url, err);
        }
        debug('AWS Queue message deleted....', data);
    });
}
module.exports = {
    message: message
}