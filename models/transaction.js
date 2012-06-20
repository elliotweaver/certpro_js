var mongoose = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.ObjectId;

var Transaction = new Schema({
    lead              : String
  , job               : String
  , price             : String
  , contractor        : String
  , payment           : String
  , created           : {type: Date, default: Date.now}
  , updated           : {type: Date, default: Date.now}
  , status            : {type: Number, default: 1}
});
	 
module.exports = mongoose.model('Transaction', Transaction);
