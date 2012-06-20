
var bcrypt = require('bcrypt')
  , check = require('validator').check
  , sanitize = require('validator').sanitize;

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

/** save **/
var save = function(values, promise) {
    
    if (values.body) {
      values = values.body;
    }
    
    var password = values.password;
    delete values[password];
    values.salt = bcrypt.genSaltSync(10);
    values.hash = bcrypt.hashSync(password, values.salt);
    user_new = new User();
    user_new.email = values.email;
    user_new.password = values.hash;
    user_new.firstname = values.firstname;
    user_new.lastname = values.lastname;
    user_new.phone = values.phone;
    user_new.dob = values.dob;
    user_new.company = values.company;
    user_new.website = values.website;
    user_new.address = values.address;
    user_new.address2 = values.address2;
    user_new.city = values.city;
    user_new.state = values.state;
    user_new.zip = values.zip;
    user_new.roles = [ 'contractor', 'terms' ]
    user_new.category = [];
    user_new.location = [];
    user_new.agreed = 1;
    user_new.status = 1;
    user_new.save(function(err, user_new) {
      if (promise) {
        if (err) return promise.fulfill([err]);
        promise.fulfill(user_new);
      }
    });
}
exports.save = save;
  
/** validate **/
var validate = function (values, callback) {
  
    var errors = [];
    
    if (values.body) {
      values = values.body;
    }
    
    try {
      values.firstname = sanitize(values.firstname).xss().trim();
      check(values.firstname).notNull();
    } catch (e) {
      errors.firstname = 'Enter a valid first name';
    }
    
    try {
      values.lastname = sanitize(values.lastname).xss().trim();
      check(values.lastname).notNull();
    } catch (e) {
      errors.lastname = 'Enter a valid last name';
    }
    
    try {
      values.phone = sanitize(values.phone).xss().trim();
      check(values.phone).notNull();
    } catch (e) {
      errors.phone = 'Enter a valid phone number';
    }
    
    try {
      values.dob = sanitize(values.dob).xss().trim();
      check(values.dob).notNull();
    } catch (e) {
      errors.dob = 'Enter a valid date of birth';
    }
    
    try {
      values.email = sanitize(values.email).xss().trim();
      check(values.email).notNull().isEmail();
    } catch (e) {
      errors.email = 'Enter a valid email';
    }
    
    try {
      values.company = sanitize(values.company).xss().trim();
      check(values.company).notNull();
    } catch (e) {
      errors.company ='Enter a valid company name';
    }
    
    try {
      values.website = sanitize(values.website).xss().trim();
    } catch (e) {
      errors.website = 'Enter a valid website';
    }
    
    try {
      values.address = sanitize(values.address).xss().trim();
      check(values.address).notNull();
    } catch (e) {
      errors.address = 'Enter a valid address';
    }
    
    try {
      values.address2 = sanitize(values.address2).xss().trim();
    } catch (e) {
      errors.address2 = 'Enter a valid address 2';
    }
    
    try {
      values.city = sanitize(values.city).xss().trim();
      check(values.city).notNull();
    } catch (e) {
      errors.city = 'Enter a valid city';
    }
    
    try {
      values.state = sanitize(values.state).xss().trim();
      check(values.state).len(2,2).isAlpha();
    } catch (e) {
      errors.state = 'Enter a valid state';
    }
    
    try {
      values.zip = sanitize(values.zip).xss().trim();
      check(values.zip).isNumeric(values.zip);
    } catch (e) {
      errors.zip = 'Enter a valid zip code';
    }
    
    try {
      values.cc_num = sanitize(values.cc_num).xss().trim();
      check(values.cc_num).isCreditCard();
    } catch (e) {
      errors.cc_num = 'Please enter a valid credit card number';
    }
    
    try {
      values.cc_mon = sanitize(values.cc_mon).xss().trim();
      check(values.cc_mon).len(2,2);
    } catch (e) {
      errors.cc_mon = 'Enter a valid credit card month between 01-12';
    }
    
    try {
      values.cc_year = sanitize(values.cc_year).xss().trim();
      check(values.cc_year).len(4,4);
    } catch (e) {
      errors.cc_year = 'Enter a valid credit card year';
    }
    
    try {
      values.cc_sec = sanitize(values.cc_sec).xss().trim();
      check(values.cc_sec).len(3,3).isNumeric();
    } catch (e) {
      errors.cc_sec = 'Enter a valid 3 digit security code';
    }
    
    try {
      values.cc_zip = sanitize(values.cc_zip).xss().trim();
      check(values.cc_sec).isNumeric();
    } catch (e) {
      errors.cc_zip = 'Enter a valid credit card zip code';
    }
    
    try {
      values.terms = sanitize(values.terms).xss().trim();
      check(values.terms).equals('agree');
    } catch (e) {
      errors.push('Please accept the terms and agreement');
      errors.terms = 'Please accept the terms and agreement';
    }
    
    var query = User.find({});
    query.where('email', values.email);
    query.limit(1);
    query.exec(function (err, docs) {
      if (docs) {
        errors.email = 'An account with that email already exists';
      }
      if (errors) {
        errors.values = values;
      }
      callback(errors);
    });

}
exports.validate = validate;
