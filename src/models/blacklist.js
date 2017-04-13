'use strict'
/**
 * Mongoose schema for email blacklist
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Schema Definition */
var blacklistSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    emailFeedbackType: String,
    blacklistTime: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'tblBlacklist'
});
var BlacklistSchema = mongoose.model('Blacklist', blacklistSchema);

module.exports.BlacklistSchema = BlacklistSchema;