'use strict';
var appCtrl = require('./controller/indexCtrl'),
    emailCtrl = require('./controller/emailCtrl'),
    trackCtrl = require('./controller/trackCtrl'),
    blacklistCtrl = require('./controller/blacklistCtrl');
module.exports = function(app) {
    //--------------------Amazon status controller --------------------------------//
    app.get('/status', appCtrl.checkHealth); // API route to check status of he application

    //--------------------Email controller--------------------------------//
    app.post('/email', emailCtrl.send); // API route to send a email using amazon ses
    app.get('/email', emailCtrl.getSendEmails); // API route to fetch all the blacklist emails

    //--------------------blacklist controller--------------------------------//
    app.get('/blacklist', blacklistCtrl.getBlacklisted); // API route to get email blacklist
    app.delete('/blacklist/:email', blacklistCtrl.removeBlacklisted); // API route to remove email from the blacklist

    //--------------------email track controller--------------------------------//
    app.get('/track', trackCtrl.trackEmail); // API route to get email blacklist

};