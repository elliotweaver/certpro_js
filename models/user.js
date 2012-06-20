var mongoose = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.ObjectId;

var User = new Schema({
    email             : String
  , password          : String
  , roles             : [String]
  , category          : [String]
  , location          : [String]
  , firstname         : String
  , lastname          : String
  , phone             : String
  , dob               : String
  , company           : String
  , website           : String
  , address           : String
  , address2          : String
  , city              : String
  , state             : String
  , zip               : String
  , cc_token          : String
  , cc_last4          : String
  , cc_customer       : String
  , cc_type           : String
  , agree             : String
  , status            : String
  , accessed          : {type: Date, default: Date.now}
  , created           : {type: Date, default: Date.now}
  , updated           : {type: Date, default: Date.now}
});
	 
module.exports = mongoose.model('User', User);
