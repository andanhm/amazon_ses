'use strict'
/**
 * Mongoose schema for email tracker
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Schema Definition */
var emailTracker = new Schema({
    emailRequestId: { type: String, default: '', index: true },
    click: [{
        type: Schema.Types.Mixed,
        default: {}
    }],
    open: [{
        type: Schema.Types.Mixed,
        default: {}
    }]
}, {
    minimize: false,
    collection: 'tblTracker'
});
var EmailTracker = mongoose.model('Tracker', emailTracker);

module.exports.EmailTracker = EmailTracker;