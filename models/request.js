var mongoose = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.ObjectId;

var Request = new Schema({
    job               : String
  , price             : String
  , location          : [String]
  , phone             : String
  , name              : String
  , address           : String
  , address2          : String
  , state             : String
  , city              : String
  , zip               : String
  , description       : String
  , created           : {type: Date, default: Date.now}
  , updated           : {type: Date, default: Date.now}
  , status            : {type: Number, default: 1}
});
	 
module.exports = mongoose.model('Request', Request);
