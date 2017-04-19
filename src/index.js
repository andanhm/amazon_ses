'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    process.env.DEBUG = process.env.DEBUG || 'app,express:application,info,ses:*,mongodb';
}

var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    log = require('./handlers/logs'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    app = require('./app'),
    config = require('./config/' + process.env.NODE_ENV);

process.env.PORT = process.env.PORT || config.port;

process.env.VERSION = require('./package.json').version || '1.0.0';

debug('environment: ' + process.env.NODE_ENV);
debug('version: ' + process.env.VERSION);

// Check if the master process is running
if (cluster.isMaster) {

    // Fork workers.
    var i = 0;
    for (i = 0; i < numCPUs * config.multiples; i += 1) {
        cluster.fork();
        debug('Cluster forked ' + i);
    }

    cluster.on('exit', function(worker, code, signal) {
        debug('worker ' + worker.process.pid + ' died with code: ' + code + ' signal: ' + signal);
        //fork an new process if app crashes
        if (code !== 0) {
            cluster.fork();
            debug('New process forked');
        }
    });

    cluster.on('online', function(worker) {
        debug('A worker with #' + worker.id + ' has started');
    });

    cluster.on('listening', function(worker, address) {
        debug('A worker ' + worker.id + ' is now connected to ' + address.address + ':' + address.port);
    });
}
var server = {};

if (cluster.isWorker) {
    //We are on one of the slave clusters so we need to listen
    server = app.listen(app.get('port'), function() {
        debug('Express server listening on port ' + server.address().port);
    });

}
process.on('exit', function(code) {
    debug('Cleaning up ... code %s ', code);
    require('./cleanup')(app);
    debug('Exiting !!!');
});

process.on('uncaughtException', function(err) {
    log.enterErrorLog(1, errSource, 'process.on', 'Unhandled exception', '', err, function() {
        process.exit(1);
    });
});

process.on('SIGINT', function() {
    debug('gotta exit - SIGINT');
    process.exit(0);
});