'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('email:' + errSource),
    awsConfig = require('../../config/' + process.env.NODE_ENV).aws.sqs, //Key can be set from environment variable or config.
    AWS = require('aws-sdk');
AWS.config.accessKeyId = awsConfig.accessKeyId;
AWS.config.secretAccessKey = awsConfig.secretAccessKey;
AWS.config.region = awsConfig.region;

// Create an SQS service object
var sqs = new AWS.SQS({
    apiVersion: awsConfig.apiVersion
});

var queueURL = awsConfig.queueUrl;

var params = {
    AttributeNames: [
        'SentTimestamp'
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        'All'
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
};

function message(callback) {
    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            debug('Receive Error', err);
            return callback(err, null)
        } else {
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, function(err, data) {
                debug('SQS delete Error %j data %j', err, data);
            });
            return callback(null, data);
        }
    });
}
module.exports = {
    message: message
}