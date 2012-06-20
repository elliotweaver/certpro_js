
var bcrypt = require('bcrypt')
  , check = require('validator').check
  , sanitize = require('validator').sanitize
  , lib = {
      common      : require('./common.js')
  }
  , Model = require('../models/category.js')
  , ls = 'category'
  , lp = 'categories'
  , us = 'Category'
  , up = 'Categories';

/** edit **/
var edit = function(req, values, callback) {
  req.session.form.values = values;
  callback();
}
exports.edit = edit;

/** create **/
var create = function(values, callback) {
  var record = new Model();
  record.name = values.name;
  record.machine = values.machine;
  record.description = values.description;
  record.save(callback);
}
exports.create = create;

/** update **/
var update = function(id, values, callback) {
  Model.findById(id, function (err, doc) {
    doc.name = values.name;
    doc.machine = values.machine;
    doc.description = values.description;
    doc.updated = Date.now();
    doc.save(callback);
  });
}
exports.update = update;
  
/** validate **/
var validate = function (req, callback) {
    
    var values = req.body;
    
    try {
      values.name = sanitize(values.name).xss().trim();
      check(values.name).notNull();
    } catch (e) {
      req.session.form.errors.name = 'Enter a valid name';
    }
    
    if (!req.params.id) {
      try {
        values.machine = sanitize(values.machine).xss().trim();
        check(values.machine).notNull();
      } catch (e) {
        req.session.form.errors.machine = 'Enter a valid machine name';
      }
    }
    
    try {
      values.description = sanitize(values.description).xss().trim();
      check(values.description).notNull();
    } catch (e) {
      req.session.form.errors.description = 'Enter a valid description';
    }
    
    var query = Model.find({});
    query.where('machine', values.machine);
    query.limit(1);
    query.exec(function (err, docs) {
      if (!lib.common.isempty(docs) && !req.params.id) {
        req.session.form.errors.machine = 'A category with that machine name already exists';
      }
      if (!lib.common.isempty(req.session.form.errors)) {
        req.session.flash.error.push( 'Please see the errors below' );
      }
      req.session.form.values = values;
      callback();
    });

}
exports.validate = validate;
