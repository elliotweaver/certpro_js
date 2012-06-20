
var bcrypt = require('bcrypt')
  , check = require('validator').check
  , sanitize = require('validator').sanitize
  , lib = {
      common      : require('./common.js')
  }
  , Model = require('../models/lead.js')
  , ls = 'lead'
  , lp = 'leads'
  , us = 'Lead'
  , up = 'Leads';

/** edit **/
var edit = function(req, values, callback) {
  req.session.form.values = values;
  callback();
}
exports.edit = edit;

/** create **/
var create = function(values, callback) {
  var record = new Model();
  record.request = values.request;
  record.contractor = values.contractor;
  record.save(callback);
}
exports.create = create;

/** update **/
var update = function(id, values, callback) { 
  Model.findById(id, function (err, doc) {
    doc.request = values.request;
    doc.contractor = values.contractor;
    doc.updated = Date.now();
    doc.save(callback);
  });
}
exports.update = update;
  
/** validate **/
var validate = function (req, callback) {

    var values = req.body;
    
    try {
      values.request = sanitize(values.request).xss().trim();
      check(values.request).notNull();
    } catch (e) {
      req.session.form.errors.request = 'Enter a valid request id';
    }
    
    try {
      values.contractor = sanitize(values.contractor).xss().trim();
      check(values.contractor).notNull();
    } catch (e) {
      req.session.form.errors.contractor = 'Enter a valid contractor id';
    }
    
    if (!lib.common.isempty(req.session.form.errors)) {
      req.session.flash.error.push( 'Please see the errors below' );
    }
    
    req.session.form.values = values;
    callback();

}
exports.validate = validate;
