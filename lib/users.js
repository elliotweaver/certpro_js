
var bcrypt = require('bcrypt')
  , check = require('validator').check
  , geo = require('geocoder')
  , sanitize = require('validator').sanitize
  , lib = {
      common      : require('./common.js')
    , braintree   : require('./braintree.js')
  }
  , Model = require('../models/user.js')
  , ls = 'user'
  , lp = 'users'
  , us = 'User'
  , up = 'Users';

/** fields **/
var fields = function(req) {
  return {
        phone: req.body.phone
      , firstname: req.body.firstname
      , lastname: req.body.lastname
      , dob: req.body.dob
      , email: req.body.email
      , company: req.body.company
      , website: req.body.website
      , address: req.body.address
      , address2: req.body.address2
      , city: req.body.city
      , state: req.body.state
      , zip: req.body.zip
      , cc_num: req.body.cc_num
      , cc_mon: req.body.cc_mon
      , cc_year: req.body.cc_year
      , cc_sec: req.body.cc_sec
      , cc_zip: req.body.cc_zip
      , terms: req.body.terms
    };
}
exports.fields = fields;

/** edit **/
var edit = function(req, values, callback) {
  req.session.form.values = values;
  callback();
}
exports.edit = edit;

/** create **/
var create = function(values, callback) {
  var password = values.password;
  delete values[password];
  values.salt = bcrypt.genSaltSync(10);
  values.hash = bcrypt.hashSync(password, values.salt);
  var record = new Model();
  record.email = values.email;
  record.password = values.hash;
  record.firstname = values.firstname;
  record.lastname = values.lastname;
  record.phone = values.phone;
  record.dob = values.dob;
  record.company = values.company;
  record.website = values.website;
  record.address = values.address;
  record.address2 = values.address2;
  record.city = values.city;
  record.state = values.state;
  record.zip = values.zip;
  record.roles = [ 'contractor', 'terms' ]
  record.category = [];
  record.agree = values.agree;
  record.status = 1;
  var address = values.address+', '+values.city+', '+values.state+' '+values.zip;
  geo.geocode(address, function (err, data) {
    record.location = [ data.results[0].geometry.location.lat, data.results[0].geometry.location.lng ];
    lib.braintree.gateway.customer.create(
      {
        creditCard: {
          number: values.cc_num,
          cvv: values.cc_sec,
          expirationDate: values.cc_mon+'/'+values.cc_year,
          options: {
            verifyCard: true
          }
        }
      }, function (err, result) {
        console.log(result);
        if (!result.success) {
          console.log('failed');
          callback();
        }
        else {
          record.cc_token = result.customer.creditCards[0].token;
          record.cc_last4 = result.customer.creditCards[0].last4;
          record.cc_type = result.customer.creditCards[0].cardType;
          record.cc_customer = result.customer.creditCards[0].customerId;
          record.save(callback(err));
        }
      }
    );
  });
}
exports.create = create;

/** update **/
var update = function(id, values, callback) { 
  
  var fields = {};
  
  if (undefined !== values.login_update && values.login_update == 'true') {
    fields.email = values.email;
    var password = values.password;
    values.salt = bcrypt.genSaltSync(10);
    values.hash = bcrypt.hashSync(password, values.salt);
    fields.password = values.hash;
  }
  
  if (undefined !== values.contact_update && values.contact_update == 'true') {
    fields.firstname = values.firstname;
    fields.lastname = values.lastname;
    fields.dob = values.dob;
    fields.phone = values.phone;
  }
  
  if (undefined !== values.company_update && values.company_update == 'true') {
    fields.company = values.company;
    fields.website = values.website;
    fields.address = values.address;
    fields.address2 = values.address2;
    fields.state = values.state;
    fields.city = values.city;
    fields.zip = values.zip;
  }
  
  fields.agree = values.agree;
  
  var address = values.address+', '+values.city+', '+values.state+' '+values.zip;
  geo.geocode(address, function (err, data) {
    fields.location = [ data.results[0].geometry.location.lat, data.results[0].geometry.location.lng ];
  
    if (undefined !== values.cc_update && values.cc_update == 'true') {
      Model.find({}).where('_id', id).limit(1).exec(function (err, docs) {
        if (err) {
          callback(err);
        }
        else {
          lib.braintree.gateway.customer.update(
            docs[0].cc_customer, 
            {
              creditCard: {
                number: values.cc_num,
                cvv: values.cc_sec,
                expirationDate: values.cc_mon+'/'+values.cc_year,
                options: {
                  updateExistingToken: docs[0].cc_token,
                  verifyCard: true
                }
              }
            }, function (err, result) {
              console.log(result);
              if (!result.success) {
                console.log('failed');
                callback(err);
              }
              else {
                fields.cc_token = result.customer.creditCards[0].token;
                fields.cc_last4 = result.customer.creditCards[0].last4;
                fields.cc_type = result.customer.creditCards[0].cardType;
                fields.cc_customer = result.customer.creditCards[0].customerId;
                Model.update({ _id: id }, fields, {}, callback);
              }
            }
          );
        }
      });
    }
    else {
      Model.update({ _id: id }, fields, {}, callback);
    }
    
  });
  
}
exports.update = update;
  
/** validate **/
var validate = function (req, callback) {

    var values = req.body;
    
    if(req.method == 'POST' || (undefined !== values.login_update && values.login_update == 'true') ) {
      
      try {
        values.email = sanitize(values.email).xss().trim();
        check(values.email).notNull().isEmail();
      } catch (e) {
        req.session.form.errors.email = 'Enter a valid email';
      }
      
      try {
        values.password = sanitize(values.password).xss().trim();
        check(values.password).notNull();
      } catch (e) {
        req.session.form.errors.password = 'Enter a valid password';
      }
      
      try {
        values.password2 = sanitize(values.password2).xss().trim();
        check(values.password2).notNull();
      } catch (e) {
        req.session.form.errors.password2 = 'Enter a valid password';
      }
      
      if (values.password !== values.password2) {
        req.session.form.errors.password2 = "Password doesn't match";
      }
      
    }
    
    if(req.method == 'POST' || (undefined !== values.contact_update && values.contact_update == 'true') ) {
    
      try {
        values.firstname = sanitize(values.firstname).xss().trim();
        check(values.firstname).notNull();
      } catch (e) {
        req.session.form.errors.firstname = 'Enter a valid first name';
      }
      
      try {
        values.lastname = sanitize(values.lastname).xss().trim();
        check(values.lastname).notNull();
      } catch (e) {
        req.session.form.errors.lastname = 'Enter a valid last name';
      }
      
      try {
        values.phone = sanitize(values.phone).xss().trim();
        check(values.phone).notNull();
      } catch (e) {
        req.session.form.errors.phone = 'Enter a valid phone number';
      }
      
      try {
        values.dob = sanitize(values.dob).xss().trim();
        check(values.dob).notNull();
      } catch (e) {
        req.session.form.errors.dob = 'Enter a valid date of birth';
      }
    
    }
    
    if(req.method == 'POST' || (undefined !== values.company_update && values.company_update == 'true') ) {
    
      try {
        values.company = sanitize(values.company).xss().trim();
        check(values.company).notNull();
      } catch (e) {
        req.session.form.errors.company ='Enter a valid company name';
      }
      
      try {
        values.website = sanitize(values.website).xss().trim();
      } catch (e) {
        req.session.form.errors.website = 'Enter a valid website';
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
    
    }
    
    if(req.method == 'POST' || (undefined !== values.cc_update && values.cc_update == 'true') ) {
    
      try {
        values.cc_num = sanitize(values.cc_num).xss().trim();
        check(values.cc_num).isCreditCard();
      } catch (e) {
        req.session.form.errors.cc_num = 'Enter a valid credit card number';
      }
      
      try {
        values.cc_mon = sanitize(values.cc_mon).xss().trim();
        check(values.cc_mon).len(1,2);
      } catch (e) {
        req.session.form.errors.cc_mon = 'Enter a valid credit card month between 01-12';
      }
      
      try {
        values.cc_year = sanitize(values.cc_year).xss().trim();
        check(values.cc_year).len(4,4);
      } catch (e) {
        req.session.form.errors.cc_year = 'Enter a valid credit card year';
      }
      
      try {
        values.cc_sec = sanitize(values.cc_sec).xss().trim();
        check(values.cc_sec).len(3,3).isNumeric();
      } catch (e) {
        req.session.form.errors.cc_sec = 'Enter a valid 3 digit security code';
      }
      
      try {
        values.cc_zip = sanitize(values.cc_zip).xss().trim();
        check(values.cc_sec).isNumeric();
      } catch (e) {
        req.session.form.errors.cc_zip = 'Enter a valid credit card zip code';
      }
      
      //validate the card
    
    }
    
    try {
      values.agree = sanitize(values.agree).xss().trim();
      check(values.agree).equals('agree');
    } catch (e) {
      req.session.form.errors.agree = 'Please accept the terms and agreement';
    }
    
    if(req.method == 'POST' || (undefined !== values.login_update && values.login_update == 'true') ) {
    
      var query = Model.find({});
      query.where('email', values.email);
      query.limit(1);
      query.exec(function (err, docs) {
        if (!lib.common.isempty(docs)) {
          if (docs[0]._id != req.params.id) {
            req.session.form.errors.email = 'An account with that email already exists';
          }
        }
        if (!lib.common.isempty(req.session.form.errors)) {
          req.session.flash.error.push( 'Please see the errors below' );
        }
        req.session.form.values = values;
        callback();
      });
      
    }
    
    else {
      if (!lib.common.isempty(req.session.form.errors)) {
        req.session.flash.error.push( 'Please see the errors below' );
      }
      req.session.form.values = values;
      callback();
    }

}
exports.validate = validate;
