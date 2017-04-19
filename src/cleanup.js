'use strict';
var errSource = errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    log = require('./handlers/logs'),
    dbHandlers = require('./handlers/mongo/mongoClient');
module.exports = function(app) {
    try {
        debug('MongoDB collection closing called' + app.get('version'));
        // Disconnect the MongoDB connection
        var db = dbHandlers.getDB();
        db.close();

    } catch (err) {
        debug('Unhandled exception cleanup ', err);
        log.enterErrorLog(1, errSource, 'close', 'Unhandled exception', '', err);
    }
};