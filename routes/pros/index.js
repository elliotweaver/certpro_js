var Categories = require('../../models/category')
  , Jobs = require('../../models/job');
  
/** /pros **/
var index = function(req, res, next) {
  res.render('pros/index', { title: 'Welcome Contractors' });
  next();
}
exports.index = index;

/** /pros/login **/
var login = function(req, res, next) {
  res.render('pros/login', { title: 'Login' });
  next();
}
exports.login = login;

/** /pros/signup **/
var signup = function(req, res, next) {
  var categories = [];
  Categories.find({}).exec(function(err, categories) {
    Jobs.find({}).exec(function(err, jobs) {
      res.render('pros/signup', { title: 'Signup', categories: categories, jobs: jobs });
      next();
    });
  });
}
exports.signup = signup;

/** /pros/faq **/
var faq = function(req, res, next) {
  next();
}
exports.faq = faq;
