'use strict';
var router = require('express').Router(); // eslint-disable-line

// Set all the headers here
router.all('*', function(req, res, next) {
  res.header('Server', require('os').hostname());
  next();
});

module.exports = function(app) {
  app.use('*', router);
  
  // Index page
//   app.use('/', require('./controllers/indexCtlr.js'));

};