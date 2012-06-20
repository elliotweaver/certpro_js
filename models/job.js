var mongoose = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.ObjectId;

var Job = new Schema({
    name              : String
  , machine           : String
  , description       : String
  , price             : String
  , categories        : [String]
  , created           : {type: Date, default: Date.now}
  , updated           : {type: Date, default: Date.now}
  , status            : {type: Number, default: 1}
});
	 
module.exports = mongoose.model('Job', Job);
