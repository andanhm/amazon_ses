'use strict';
var appCtrl = require('./controller/indexCtrl'),
    emailCtrl = require('./controller/emailCtrl');
module.exports = function(app) {
    //--------------------Amazon status controller --------------------------------//
    app.get('/status', appCtrl.checkHealth); // API route to check status of he application

    //--------------------Email controller--------------------------------//
    app.post('/send', emailCtrl.send); // API route to send a email using amazon ses
    app.get('/blacklist', emailCtrl.getBlacklisted); // API route to fetch all the blacklist emails
};