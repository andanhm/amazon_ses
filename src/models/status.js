'use strict'
/**
 * Mongoose schema for email request status
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Schema Definition */
var statusSchema = new Schema({
    body: String,
    subject: String,
    fromEmail: String,
    fromName: String,
    toEmail: String,
    toName: String,
    bcc: String,
    tid: String,
    response: {
        type: Schema.Types.Mixed,
        default: {}
    },
    msgid: String,
    reqStamp: {
        type: Date,
        default: Date.now
    },
    attachment: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    minimize: false,
    collection: 'tblStatus'
});
var EmailStatus = mongoose.model('Status', statusSchema);

module.exports.EmailStatus = EmailStatus;