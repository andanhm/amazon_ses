'use strict';
var errSource = require('path').basename(__filename),
    mongoose = require('mongoose'),
    log = require('../../handlers/logs.js'),
    qManConfig = require('../../config/' + process.env.NODE_ENV),
    debug = require('debug')('ses:mongodb'),
    db = {};

/**
 * Callback error details if unable to connect the MongoDB
 * @callback connectCallback
 * @param {} No return function will be called if their is no error connecting to MongoDB
 * @param {Object} err MongoDB error object stacks
 */
/**
 * Connect method to connect to the mongodb server
 *
 * @api public
 * @method
 * @param  {connectCallback} callback - A callback to MongoDB connection error details
 */
function connect() {
    var mongoOption = {
        db: {
            'native_parser': false
        },
        server: {
            'auto_reconnect': true,
            socketOptions: {
                connectTimeoutMS: 500
            }
        }
    };
    var mongoDBUri = qManConfig.db.mongo;
    mongoose.connect(qManConfig.db.mongo, mongoOption);
    db = mongoose.connection;
    db.on('error', function(err) {
        log.enterErrorLog(0, errSource, 'connect', mongoDBUri, 'Failed to connect mongodb', err);
        debug('Error connecting to MongoDB ', mongoDBUri);
    });
    db.once('open', function callback() {
        debug('New connection to MongoDB %s ', mongoDBUri);
    });
}
/**
 * Return MongoDB database object
 *
 * @api public
 * @method
 * @returns {Object} returns The **Collection** class is an internal class that embodies a MongoDB collections
 */
function getDB() {
    return db;
}

module.exports = {
    connect: connect,
    getDB: getDB
};