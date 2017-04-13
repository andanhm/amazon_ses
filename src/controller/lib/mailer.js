'use strict';
/**
 * Mailer process email
 */
var errSource = require('path').basename(__filename),
    debug = require('debug')('email:' + errSource),
    config = require('../../config/' + process.env.NODE_ENV),
    path = require('path'),
    log = require('../../handlers/logs.js'),
    statusDB = require('../db/statusDB'),
    blacklistDB = require('../db/blacklistDB'),
    querystring = require('querystring'),
    childProcess = require('child_process'),
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
            body: param.body,
            subject: param.subject,
            toEmail: param.email,
            toName: param.toname,
            bcc: (param.bcc ? param.bcc : null),
            reqStamp: new Date(),
            attachment: param.attachment
        };

        self.sendMail(messageObj, function(err, data) {
            if (err) {
                log.enterErrorLog('4004', errSource, 'sendMail', 'Error when sending to aws', 'Error when sending to AWS SES', err);
                return callback(err, null);
            }
            /* Checks the if email have any attachments and cleanup all the attachment file from the disk
               Its messy code we can do it better way but followed as per doCleanup common functions */
            if (messageObj.attachment) {
                var attachment = messageObj.attachment;
                var fileDir = config.attachmentFileDir;
                var filePath = path.dirname(attachment.path);
                param = path.basename(filePath);
                self.doCleanup(param, fileDir, function() {});
            }
            messageObj.msgid = data.messageId;
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
    var toEmail = request.toEmail.toLowerCase(),
        toName = request.toName ? request.toName : '';

    var parameters = {
        to: toName + '<' + toEmail + '>',
        subject: request.subject,
        message: request.body,
        cc: ''
    };

    if (request.ticket) {
        parameters.attachments = request.attachment;
    }

    debug('AWS SES Request %j', parameters);
    var ses = require('./ses'),
        mailer = ses.createClient();
    mailer.sendEmail(parameters, function(err, data) {
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
                requeue: false,
                error: err
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

    self.mongoCon.fetchAll(emailBlacklist.schema, {}, {
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
 * @param {String} param File name
 * @param {callback} callback Return the response of shell execution
 */
Mailer.prototype.doCleanup = function(param, dirName, callback) {
    var filePath = path.join(__dirname, '../', dirName, param);
    debug('doTicketCleanup->', 'rm -Rf ' + filePath);
    childProcess.exec('rm -Rf ' + filePath, function(err, stdout, stderr) {
        if (err) {
            return callback(err);
        }

        if (stderr) {
            return callback(stderr);
        }

    });
};
/**
 * Gets the email status information from the MongoDB based on the msgid,email,tid
 *
 * @memberof Mailer.prototype
 * @param {String} query HTTP get request parameter
 * @param {callback} callback Return status of the email information
 */
Mailer.prototype.getStatus = function(query, callback) {
    var params = querystring.parse(query);

    // if none of the parameters are present, return error
    if (typeof(params.msgid) == 'undefined' && typeof(params.tid) == 'undefined' && typeof(params.email) == 'undefined') {
        return callback(null, 'result=false&msgid=0&errno=12');
    }

    // if a parameter is present, it should have a non-empty value
    if (typeof(params.msgid) !== 'undefined' && params.msgid === '') {
        return callback(null, 'result=false&msgid=0&errno=12');
    }
    if (typeof(params.tid) !== 'undefined' && params.tid === '') {
        return callback(null, 'result=false&msgid=0&errno=12');
    }
    if (typeof(params.email) !== 'undefined' && params.email === '') {
        return callback(null, 'result=false&msgid=0&errno=12');
    }

    var search = {};

    if (params.msgid) {
        search.msgid = params.msgid;
    } else if (params.tid) {
        search.tid = params.tid;
    } else {
        search.toEmail = params.email;
    }
    // query mongo and sort by insStamp
    self.mongoCon.fetchAll(emailStatus.schema, search, {
        app: 0,
        __v: 0
    }, {
        sort: {
            insStamp: -1
        }
    }, function(err, resultCollection) {
        if (err) {
            debug('Error in fetch email information from mongo ', err);
            return callback(null, 'result=false&msgId=' + params + '&errno=1');
        }
        if (resultCollection === null) {
            return callback(null, 'result=false&msgId=' + params + '&errno=13');
        }
        return callback(null, resultCollection);
    });
};

/**
 * Remove email from blacklist
 *
 * @memberof Mailer.prototype
 * @param {callback} callback Return two object error, result
 */
Mailer.prototype.removeEmailFromBlacklist = function(query, callback) {
    var params = querystring.parse(query);

    // if none of the parameters are present, return error
    if (typeof(params.email) == 'undefined') {
        return callback(null, 'result=false&msgid=0&errno=13');
    }
    // if a parameter is present, it should have a non-empty value
    if (typeof(params.email) !== 'undefined' && params.email === '') {
        return callback(null, 'result=false&email=0&errno=13');
    }

    var deleteQuery = {};

    if (params.email) {
        deleteQuery.email = params.email;
    }

    self.mongoCon.removeQuery(emailBlacklist.schema, deleteQuery, function(err, result) {
        if (err) {
            debug('Error in mongodb->removeEmailFromBlacklist: ', err);
            log.enterErrorLog('6011', errSource, 'removeEmailFromBlacklist', 'Failed to get the mongo email information', 'Failed to fetch the collection from mongo', err);
            return callback(err, null);
        }
        //Remove the specified members from the set stored at key (email)
        return callback(null, 'ok');
    });

};

module.exports = Mailer;