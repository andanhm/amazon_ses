'use strict';
/**
 * Mailer process email
 */
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    config = require('../../config/' + process.env.NODE_ENV),
    path = require('path'),
    log = require('../../handlers/logs.js'),
    statusDB = require('../db/statusDB'),
    blacklistDB = require('../db/blacklistDB'),
    fs = require('fs'),
    self = {};

/**
 * Mailer 
 * 
 * Main function of this file which is exported the object that will call functions from this library is scoped global
 * Create mongo connection and assign the connection object to mongoCon property of calling object
 * @class
 *
 * @constructor
 */
function Mailer() {
    self = this;
}

/**
 * Send an email  by sanitizing user inputs
 * Validate parameters passed in the request and return error if any validation fails
 * Attache's all the account configuration details email request object
 * Validate parameters passed in the request and return error if any validation fails
 * 
 * @memberof Mailer.prototype
 * @param {Object} objSendEmail Email request object
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.processEmail = function(objSendEmail, callback) {
    var param = objSendEmail;

    debug('Params', param);

    if (param.email) {
        param.email = param.email.trim();
    }

    var err = self.validateRequest(param);

    if (err !== 0) {
        log.enterErrorLog(2002, errSource, 'validateRequest', 'Validation failed for this request', err);
        return callback({
            message: err
        }, null);
    }
    blacklistDB.isEmailBlacklisted(param.email, function(err, emailStatus) {
        debug('isEmailBlacklisted->emailStatus', emailStatus, err);
        if (err) {
            return callback(err, null);
        }
        if (emailStatus) {
            log.error(2002, errSource, 'isEmailBlacklisted', param.email + ' is blacklisted, hence not sending email to this recipient', '');
            return callback(err, null);
        }

        var messageObj = {
            from: config.fromEmail,
            message: param.message,
            subject: param.subject,
            to: param.name + '<' + param.email + '>',
            bcc: param.bcc || '',
            requestStamp: new Date(),
            attachment: param.attachment
        };
        self.sendMail(messageObj, function(err, data) {
            if (err) {
                log.enterErrorLog('4004', errSource, 'sendMail', 'Error when sending to aws', 'Error when sending to AWS SES', err);
                messageObj.response = {
                    requestId: err.requestId,
                    message: err.message,
                    time: err.time,
                    code: err.code
                };
                messageObj.status = 'failed';
            } else {
                messageObj.messageId = data.messageId;
                messageObj.status = 'success';
            }
            /* Checks the if email have any attachments and cleanup all the attachment file from the disk
                   Its messy code we can do it better way but followed as per doCleanup common functions */
            if (messageObj.attachment) {
                var attachment = messageObj.attachment;
                attachment.forEach(function(file) {
                    var fileName = file.filename;
                    self.doCleanup(fileName);
                });
            }
            self.saveResponse(messageObj, function(err, result) {
                return callback(err, result);
            });

        });

    });
}

/**
 * Sends the email to AWS SES API (actual send)
 *
 * @memberof Mailer.prototype
 * @param {Object} objSendEmail Email request object
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.sendMail = function(request, callback) {
    debug('AWS SES Request %j', request);
    var ses = require('./ses'),
        mailer = ses.createClient();
    mailer.sendEmail(request, function(err, data) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, data);
    });
};
/**
 * Save the response status of the SES email received by AWS in to MongoDB
 *
 * @memberof Mailer.prototype
 * @param {Object} emailSentResponse Email response object (msgId)
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.saveResponse = function(emailSentResponse, callback) {
    statusDB.saveEmailStatusRecord(emailSentResponse, function(err, result) {
        if (err) {
            debug('Error in mongodb: ', err);
            log.enterErrorLog('4005', errSource, 'saveResponse', 'Failed to insert in mongo', 'Failed to insert in mongo', err);
            return callback({
                status: false,
                code: 4005,
                file: errSource,
                function: 'saveResponse',
                message: 'Failed to insert in mongo',
                time: new Date()
            }, null);
        }
        debug('Inserted into mongo %j', result);
        return callback(null, {
            'success': 'Successfully sent to aws ses'
        });
    });
};
/**
 * Validate the email request parameters
 *
 * @memberof Mailer.prototype
 * @param {Object} parameters Email request object
 * @return {String} Return required missing parameters else 0
 */
Mailer.prototype.validateRequest = function(parameters) {
    if (typeof(parameters.email) === 'undefined' || parameters.email === '') {
        return 'Enter an EmailId';
    }
    if (!parameters.email.match(/^([a-zA-Z0-9_\-\.]+)@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,6})$/)) {
        return 'Email Format is incorrect';
    }
    if (typeof(parameters.subject) === 'undefined' || parameters.subject === '') {
        return 'Enter a subject';
    }
    if (parameters.message === '') {
        return 'Enter a message';
    }
    return 0;
};

/**
 * Fetch all the blacklist emails
 *
 * @memberof Mailer.prototype
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.listEmailBlacklisted = function(callback) {
    blacklistDB.getBlacklist({}, {
        _id: 0,
        __v: 0
    }, function(err, blackListedEmails) {
        debug('self.mongoCon.fetchOne->', blackListedEmails);
        if (err) {
            debug('Error in mongodb: ' + err);
            log.enterErrorLog('6010', errSource, 'listEmailBlacklisted', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        return callback(null, blackListedEmails);
    });
};


/**
 * Read the file mine type attachment and return the content in a json document
 * 
 * Returns object in following format
 * {
 *   filename: file.name,
 *   path: file.path,
 *   contentType: mineType
 * }
 * @memberof Mailer.prototype
 * @param {Object} file Attache file details
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.processFile = function(file, callback) {
    var mineType = require('mime-types').contentType(path.extname(file.path)),
        attachment = {
            filename: file.name,
            path: file.path,
            contentType: mineType
        };
    debug('processFile-> attachment', attachment);
    return callback(null, attachment);
};

/**
 * Delete all the uncompressed files
 *
 * @memberof Mailer.prototype
 * @param {String} filename File name
 */
Mailer.prototype.doCleanup = function(filename) {
    var filePath = path.join(__dirname, '../../', 'uploads', filename);
    debug('doCleanup', filePath);
    fs.unlink(filePath, function(err) {
        if (err && err.code == 'ENOENT') {
            debug('doCleanup', 'File does not exist, wont remove it.');
        } else if (err) {
            debug('doCleanup', 'Error occurred while trying to remove file');
        } else {
            debug('doCleanup', 'File removed');
        }
    });
};
/**
 * Gets the email status information from the MongoDB based on the msgid,email,tid
 *
 * @memberof Mailer.prototype
 * @param {String} params Email checking status object
 * @param {callback} callback Return status of the email information
 */
Mailer.prototype.getStatus = function(params, callback) {
    // if a parameter is present, it should have a non-empty value
    if (typeof(params.msgid) !== 'undefined' && params.msgid === '') {
        return callback({ message: 'Message Id not passed' }, null);
    }
    if (typeof(params.email) !== 'undefined' && params.email === '') {
        return callback({ message: 'Email address not passed' }, null);
    }

    var search = {};

    if (params.msgid) {
        search.msgid = params.msgid;
    } else {
        search.email = params.email;
    }
    // TODO: Need to implement get email status report
    return callback(null, []);
};

/**
 * Remove email from blacklist
 *
 * @memberof Mailer.prototype
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.removeEmailFromBlacklist = function(email, callback) {

    // if none of the parameters are present, return error
    if (typeof(email) == 'undefined') {
        return callback(null, 'result=false&msgid=0&errno=13');
    }
    // if a parameter is present, it should have a non-empty value
    if (typeof(email) !== 'undefined' && email === '') {
        return callback(null, 'result=false&email=0&errno=13');
    }

    var deleteQuery = {};
    deleteQuery.email = email;
    // TODO: Need to implement delete email from the blacklist
    return callback(null, { status: true, message: 'Removed from blacklist' });
};

module.exports = Mailer;