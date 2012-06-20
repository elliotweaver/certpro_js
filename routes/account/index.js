var lib = {
      query       : require('../../lib/query.js')
  }
  , Leads = require('../../models/lead')
  , Categories = require('../../models/category')
  , Jobs = require('../../models/job');

/** /account **/
var index = function(req, res, next) {
  var query = Leads.find({});
  var filter = lib.query.filter(req, query);
  query.sort('updated', -1);
  query.exec(function(err, rows) {
    Categories.find({}).exec(function(err, categories) {
      Jobs.find({}).exec(function(err, jobs) {
        res.render('account/index', { title: 'Account', method: 'put', rows: rows, pager: filter.pager, categories: categories, jobs: jobs });
        next();
      });
    });
  });
}
exports.index = index;
