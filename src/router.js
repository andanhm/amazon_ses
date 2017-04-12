'use strict';
var appCtrl = require('./controller/indexCtrl'),
    emailCtrl = require('./controller/emailCtrl');

module.exports = function(app) {
  app.get('/status', appCtrl.checkHealth);
  app.get('/send', emailCtrl.send);
};