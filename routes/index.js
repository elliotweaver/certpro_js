
var admin = require('./admin');
exports.admin = admin;

var account = require('./account');
exports.account = account;

var pros = require('./pros');
exports.pros = pros;

/** index **/
var index = function(req, res, next) {
  res.render('index', { title: 'Welcome Homeowners!' });
  next();
};
exports.index = index;
