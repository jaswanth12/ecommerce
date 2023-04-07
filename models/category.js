var mongoose=require('mongoose');
var categorySchema = new mongoose.Schema({
	cname:String,
	cimage:String
	
});

module.exports= mongoose.model("category",categorySchema);