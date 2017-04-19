'use strict';
var errSource = require('path').basename(__filename),
    log = require('../../handlers/logs.js'),
    debug = require('debug')('ses:' + errSource),
    EmailBlacklist = require('../../models/blacklist').BlacklistSchema;

/**
 * Callback for getting the MongoDB save status
 * 
 * @callback pushInToQueueCallback
 * @param {Object} err Returns status of the MongoDB record
 * @param {Object} result Returns the email details with MongoDB _id 
 */
/**
 * Insert email status record to the email status collection
 * 
 * @function saveEmailBlacklist
 * @param  {String} email Email address
 * @param  {String} emailFeedbackType  Email matrix type
 * @param  {saveEmailBlacklistCallback} callback - A callback to blacklist
 */
function saveEmailBlacklist(email, emailFeedbackType, callback) {
    var emailBlacklist = new EmailBlacklist({
        email: email
    });
    emailBlacklist.save(function(err, result) {
        debug('saveEmailStatusRecord err : %j result : %j', err, result);
        if (err) {
            log.enterErrorLog(6010, errSource, 'saveEmailStatusRecord', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        return callback(null, result);
    });
}
/**
 * Callback for getting the status of the email
 * 
 * @callback isEmailBlacklistedCallback
 * @param {Object} err Returns status of the MongoDB record
 * @param {Boolean} status Returns the status of the email
 */
/**
 * Allows to determine whether email is back listed from sending email 
 * 
 * @function isEmailBlacklisted
 * @param {String} email Email address
 * @param {isEmailBlacklistedCallback} callback Return two object error, status
 */
function isEmailBlacklisted(email, callback) {
    EmailBlacklist.findOne({
        'email': email
    }, function(err, blackListedEmail) {
        if (err) {
            debug('isEmailBlacklisted->Error in mongodb', err);
            log.enterErrorLog(6010, errSource, 'isEmailBlacklisted', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        debug('isEmailBlacklisted->self.mongoCon.fetchOne->', blackListedEmail);
        if (blackListedEmail) {
            return callback(null, true);
        }
        return callback(null, false);
    });
}
/**
 * Callback for fetching all the ses email records
 * 
 * @callback getBlacklistCallback
 * @param {Object} err Returns status of the MongoDB record
 * @param {Array<Object>} status Returns the record of the email
 */
/**
 * Allows to fetch all record of the 
 * 
 * @function getBlacklist
 * @param {Object} query Search query to find the data
 * @param {Object} fields Search query to filter the fields
 * @param {getBlacklistCallback} callback Return two object error, result
 */
function getBlacklist(query, fields, callback) {
    EmailBlacklist.find(query, fields, function(err, blackListedEmail) {
        if (err) {
            debug('getBlacklist->Error in mongodb', err);
            log.enterErrorLog(6010, errSource, 'getBlacklist', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        return callback(null, blackListedEmail);
    });
}
/**
 * Callback for deleting blacklist from the ses blacklist
 * 
 * @callback getBlacklistCallback
 * @param {Object} err Returns status of the MongoDB record
 * @param {Array<Object>} status Returns the status of the delete
 */
/**
 * Allows to delete the email from the blacklist 
 * 
 * @function getBlacklist
 * @param {String} email Email address need to remove from the blacklist
 * @param {getBlacklistCallback} callback Return two object error, result
 */
function removeEmailFromBlacklist(email, callback) {
    EmailBlacklist.remove({ email: email }, function(err, status) {
        if (err) {
            debug('getBlacklist->Error in mongodb', err);
            log.enterErrorLog(6010, errSource, 'removeEmailFromBlacklist', 'Failed to remove the mongo email information', 'Failed to remove the collection from mongo', err);
            return callback(err, null);
        }
        return callback(null, status);
    });
}

module.exports = {
    saveEmailBlacklist: saveEmailBlacklist,
    isEmailBlacklisted: isEmailBlacklisted,
    getBlacklist: getBlacklist,
    removeEmailFromBlacklist: removeEmailFromBlacklist
}