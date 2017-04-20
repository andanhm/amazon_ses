'use strict'
/**
 * Mongoose schema for email request status
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Schema Definition */
var statusSchema = new Schema({
    body: { type: String, default: '' },
    subject: { type: String, default: '' },
    from: { type: String, default: '' },
    to: { type: String, default: '', index: true },
    bcc: { type: String, default: '' },
    emailRequestId: { type: String, default: '', index: true },
    response: {
        type: Schema.Types.Mixed,
        default: {}
    },
    messageId: { type: String, default: '' },
    requestStamp: {
        type: Date,
        default: Date.now
    },
    attachment: {
        type: Schema.Types.Mixed,
        default: {}
    },
    status: String
}, {
    minimize: false,
    collection: 'tblStatus'
});
var EmailStatus = mongoose.model('Status', statusSchema);

module.exports.EmailStatus = EmailStatus;