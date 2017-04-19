'use strict';
var errSource = require('path').basename(__filename),
    debug = require('debug')('ses:' + errSource),
    http = require('./handlers/http'),
    multer = require('multer'),
    path = require('path');

debug('environment: ' + process.env.NODE_ENV);
debug('version: ' + process.env.VERSION);

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.set('env', process.env.NODE_ENV);
app.set('port', process.env.PORT);
app.set('debug', process.env.DEBUG);
app.set('version', process.env.VERSION);

app.use(require('cookie-parser')()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.disable('x-powered-by');
app.disable('etag');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(multer({ dest: path.join(__dirname, 'uploads') }).any());

//Create a middleware that adds a X-Response-Time header to responses.
app.use(require('response-time')());

//Create a middleware that adds a X-App-Version header to responses.
app.use(function(req, res, next) {
    res.setHeader('X-App-Version', app.get('version'));
    res.header('X-Server-Name', require('os').hostname());
    next();
});

app.all(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Max-Age', '60000');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
/**
 * API routes
 */
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendfile('public/index.html', { root: __dirname })
});

var favicon = require('serve-favicon');

//use favicon icon path to access in application.
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));

require('./router.js')(app);
/**
 * A background service to manage the queue
 */

// Initialize mongo db connection
require('./handlers/mongo/mongoClient').connect();

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.status(404).send({
        error: {
            url: http.formatRequestUrl(req),
            message: http.getStatusText(404),
        },
        data: {},
        version: app.get('version')
    });
});

if (app.get('env') === 'development') {
    app.use(function(error, req, res, next) {
        debug('http_status: %d, %s', error.status || 500, error.message);
        next(error);
    });
}

app.use(function(error, req, res) {
    res.status(error.status || 500).send({
        error: {
            title: 'error',
            error: error,
            message: error.message,
            trace: error.stack
        },
        data: {},
        version: app.get('version')
    });
});

module.exports = app;