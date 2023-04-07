var mongoose=require('mongoose');
var cartitm=require('../models/review');

var productSchema = new mongoose.Schema({
	category:String,
	pname:String,
	pprice:Number,
	image:String,
	//reviews:[reviewSchema],
	feedbacked:[
	{
		 type: mongoose.Schema.Types.ObjectId,
         ref: "feedback"
	}]
});
module.exports=mongoose.model("product",productSchema);
