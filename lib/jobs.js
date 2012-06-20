
var bcrypt = require('bcrypt')
  , check = require('validator').check
  , sanitize = require('validator').sanitize
  , lib = {
      common      : require('./common.js')
  }
  , Model = require('../models/job.js')
  , ls = 'job'
  , lp = 'jobs'
  , us = 'Job'
  , up = 'Jobs';

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
  record.price = values.price;
  var arr = values.categories.split(',');
  for (i in arr) {
    record.categories.push( arr[i] );
  }
  record.save(callback);
}
exports.create = create;

/** update **/
var update = function(id, values, callback) { 
  var arr = values.categories.split(',')
    , categories = [];
  for (i in arr) {
    categories.push( arr[i] );
  }
  Model.update(
      { _id: id }
    , {
        name          : values.name
      , machine       : values.machine
      , description   : values.description
      , price         : values.price
      , categories    : categories
    }
    , {}
    , callback
  );
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
    
    try {
      values.price = sanitize(values.price).xss().trim();
      check(values.price).notNull();
    } catch (e) {
      req.session.form.errors.price = 'Enter a valid price';
    }
    
    var query = Model.find({});
    query.where('machine', values.machine);
    query.limit(1);
    query.exec(function (err, docs) {
      if (!lib.common.isempty(docs) && !req.params.id) {
        req.session.form.errors.machine = 'A job with that machine name already exists';
      }
      if (!lib.common.isempty(req.session.form.errors)) {
        req.session.flash.error.push( 'Please see the errors below' );
      }
      req.session.form.values = values;
      callback();
    });

}
exports.validate = validate;
