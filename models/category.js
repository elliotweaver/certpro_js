var mongoose = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.ObjectId;

var Category = new Schema({
    name              : String
  , machine           : String
  , description       : String
  , created           : {type: Date, default: Date.now}
  , updated           : {type: Date, default: Date.now}
  , status            : {type: Number, default: 1}
});
	 
module.exports = mongoose.model('Category', Category);
