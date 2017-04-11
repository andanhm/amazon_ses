'use strict';
var appCtrl = require('./controller/index'),
    emailCtrl = require('./controller/email');

module.exports = function(app) {
  app.get('/status', appCtrl.checkHealth);
  app.get('/send', appCtrl.checkHealth);
};