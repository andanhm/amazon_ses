'use strict';
var appCtrl = require('./controller/indexCtrl'),
    emailCtrl = require('./controller/emailCtrl');
module.exports = function(app) {
    //--------------------Amazon status controller --------------------------------//
    app.get('/status', appCtrl.checkHealth); // API route to check status of he application

    //--------------------Email controller--------------------------------//
    app.post('/email', emailCtrl.send); // API route to send a email using amazon ses
    app.get('/email', emailCtrl.getSendEmails); // API route to fetch all the blacklist emails
};