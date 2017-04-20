'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    log = require('../../handlers/logs.js'),
    EmailTracker = require('../../models/track').EmailTracker;
/**
 * Callback for adding email open details
 * 
 * @callback openCallback
 * @param {Object} err Returns mongo update error details
 * @param {Object} status Returns the number record updated  
 */
/**
 * Insert the 
 * 
 * @param  {Object} emailRequestId  Email request ID to track the email
 * @param  {openCallback} callback - A callback to update email open status details
 */
function open(emailRequestId, callback) {
    console.log(emailRequestId)
    EmailTracker.findOneAndUpdate({
            emailRequestId: emailRequestId
        }, {
            $push: {
                open: {
                    date: new Date()
                }
            }
        }, { safe: true, upsert: true },
        function(err, result) {
            console.log(err, result)
            debug('open err : %j result : %j', err, result);
            if (err) {
                log.enterErrorLog(6003, errSource, 'open', 'Failed to update the mongo email information', 'Failed to update the collection to mongo', err);
                return callback(err, null);
            }
            return callback(null, result);
        });
}
module.exports = {
    open: open
}