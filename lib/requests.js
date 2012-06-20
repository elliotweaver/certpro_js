
var bcrypt = require('bcrypt')
  , check = require('validator').check
  , geo = require('geocoder')
  , sanitize = require('validator').sanitize
  , lib = {
      common      : require('./common.js')
  }
  , Model = require('../models/request.js')
  , ls = 'request'
  , lp = 'requests'
  , us = 'Request'
  , up = 'Requests';

/** edit **/
var edit = function(req, values, callback) {
  req.session.form.values = values;
  callback();
}
exports.edit = edit;

/** create **/
var create = function(values, callback) {
  
  // get contractors
  
  // foreach contractor get cc info
  
    // attempt to charge the card
  
  var record = new Model();
  record.job = values.job;
  record.price = values.price;
  record.phone = values.phone;
  record.name = values.name;
  record.address = values.address;
  record.address2 = values.address2;
  record.state = values.state;
  record.city = values.city;
  record.zip = values.zip;
  var address = values.address+', '+values.city+', '+values.state+' '+values.zip;
  geo.geocode(address, function (err, data) {
    record.location = [ data.results.geometry.location.lat, data.results.geometry.location.lng ];
    record.save(callback); 
  });
}
exports.create = create;

/** update **/
var update = function(id, values, callback) { 
  var address = values.address+', '+values.city+', '+values.state+' '+values.zip;
  geo.geocode(address, function (err, data) {
    Model.update(
        { _id: id }
      , {
            job       : values.job
          , price     : values.price
          , phone     : values.phone
          , location  : [ data.results[0].geometry.location.lat, data.results[0].geometry.location.lng ]
          , name      : values.name
          , address   : values.address
          , address2  : values.address2
          , state     : values.state
          , city      : values.city
          , zip       : values.zip
          , updated   : Date.now()
      }
      , {}
      , callback
    );
  });
}
exports.update = update;
  
/** validate **/
var validate = function (req, callback) {

    var values = req.body;
    
    try {
      values.job = sanitize(values.job).xss().trim();
      check(values.job).notNull();
    } catch (e) {
      req.session.form.errors.job = 'Enter a valid job id';
    }
    
    try {
      values.price = sanitize(values.price).xss().trim();
      check(values.price).notNull();
    } catch (e) {
      req.session.form.errors.price = 'Enter a valid price';
    }
    
    try {
      values.phone = sanitize(values.phone).xss().trim();
      check(values.phone).notNull();
    } catch (e) {
      req.session.form.errors.phone = 'Enter a valid phone';
    }
    
    try {
      values.name = sanitize(values.name).xss().trim();
      check(values.name).notNull();
    } catch (e) {
      req.session.form.errors.name = 'Enter a valid name';
    }
    
    try {
      values.address = sanitize(values.address).xss().trim();
      check(values.address).notNull();
    } catch (e) {
      req.session.form.errors.address = 'Enter a valid address';
    }
    
    try {
      values.address2 = sanitize(values.address2).xss().trim();
    } catch (e) {
      req.session.form.errors.address2 = 'Enter a valid address2';
    }
    
    try {
      values.state = sanitize(values.state).xss().trim();
      check(values.state).notNull();
    } catch (e) {
      req.session.form.errors.state = 'Enter a valid state';
    }
    
    try {
      values.city = sanitize(values.city).xss().trim();
      check(values.city).notNull();
    } catch (e) {
      req.session.form.errors.city = 'Enter a valid city';
    }
    
    try {
      values.zip = sanitize(values.zip).xss().trim();
      check(values.zip).notNull();
    } catch (e) {
      req.session.form.errors.zip = 'Enter a valid zip';
    }
    
    if (!lib.common.isempty(req.session.form.errors)) {
      req.session.flash.error.push( 'Please see the errors below' );
    }
    
    req.session.form.values = values;
    callback();

}
exports.validate = validate;
