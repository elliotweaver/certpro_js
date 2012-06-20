var lib = {
      query       : require('../../lib/query.js')
    , model        : require('../../lib/users.js')
    , common      : require('../../lib/common.js')
  }
  , Model = require('../../models/user.js')
  , ls = 'user'
  , lp = 'users'
  , us = 'User'
  , up = 'Users';

/** index **/
var index = function(req, res, next) {
  var query = Model.find({});
  var filter = lib.query.filter(req, query);
  query.sort('updated', -1);
  query.run(function(err, docs) {
    res.render('admin/'+lp+'/index', { title: 'Manage '+up, rows: docs, pager: filter.pager });
    next();
  });
}
exports.index =  index;

/** add **/
var add = function(req, res, next) {
  res.render('admin/'+lp+'/form', { title: 'Add '+us, method: 'post' });
  next();
}
exports.add = add;

/** create **/
var create = function(req, res, next) {
  lib.model.validate(req, function() {
    if (!lib.common.isempty(req.session.form.errors)) {
      res.render('admin/'+lp+'/form', { title: 'Add '+us, method: 'post' });
      next();
    }
    else {
      lib.model.create(req.session.form.values, function(err) {
        if (err) {
          req.session.flash.error.push( err );
          res.render('admin/'+lp+'/form', { title: 'Add '+us, method: 'post' });
          next();
        }
        else {
          req.session.flash.success.push( us+ ' created' );
          res.redirect('admin/'+lp);
        }
      });
    }
  });
}
exports.create = create;

/** show **/
var show = function(req, res, next) {}
exports.show = show;

/** edit **/
var edit = function(req, res, next) {
  Model.findById(req.params.id, function (err, docs) {
    if (err) {
      req.session.alert.error.push( err );
      res.redirect('admin/'+lp);
    }
    else if (lib.common.isempty(docs)) {
      req.session.alert.error.push( 'Unknown ID' );
      res.redirect('admin/'+lp);
    }
    else {
      lib.model.edit(req, docs, function() {
        res.render('admin/'+lp+'/form', { title: 'Edit '+us, method: 'put' });
        next();
      });
    }
  });
}
exports.edit = edit;

/** update **/
var update = function(req, res, next) {
  lib.model.validate(req, function(report) {
    if (!lib.common.isempty(req.session.form.errors)) {
      res.render('admin/'+lp+'/form', { title: 'Edit '+us, method: 'put' });
      next();
    }
    else {
      lib.model.update(req.params.id, req.session.form.values, function(err) {
        if (err) {
          req.session.flash.error.push( err );
          res.render('admin/'+lp+'/form', { title: 'Add '+us, method: 'put' });
          next();
        }
        else {
          req.session.flash.success.push( us+' updated' );
          res.redirect('admin/'+lp);
        }
      });
    }
  });
}
exports.update = update;

/** delete **/
var del = function(req, res, next) {
  res.render('admin/delete', { title: 'Are you sure you want to delete the '+us, id: req.params.id, method: 'delete' });
  next();
}
exports.del = del;

/** destroy **/
var destroy = function(req, res, next) {
  Model.findById(req.params.id, function (err, doc) {
    if (err) {
      req.session.flash.error.push( err );
      res.redirect('/admin/'+lp);
    }
    else {
      doc.remove(function(err) {
        if (err) {
          req.session.flash.error.push( err );
        }
        else {
          req.session.flash.success.push( us+' deleted' );
        }
        res.redirect('/admin/'+lp);
      });
    }
  });
}
exports.destroy = destroy;
