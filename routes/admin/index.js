

var users = require('./users.js');
exports.users = users;

var categories = require('./categories.js');
exports.categories = categories;

var jobs = require('./jobs.js');
exports.jobs = jobs;

var requests = require('./requests.js');
exports.requests = requests;

var leads = require('./leads.js');
exports.leads = leads;

var transactions = require('./transactions.js');
exports.transactions = transactions;

var index = function(req, res) {
  res.redirect('/admin/users');
}
exports.index = index;

var stats = function(req, res) {}
exports.stats = stats;
