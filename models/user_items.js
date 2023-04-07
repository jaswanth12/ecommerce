var mongoose=require('mongoose');
var boughtitem=require('../models/bought_items');
var user_items = new mongoose.Schema({
	userid:{
		    type: mongoose.Schema.Types.ObjectId,
            ref: "user"
    },
	username:String,
	boughtitems:[
	{
		 type: mongoose.Schema.Types.ObjectId,
         ref: "boughtitem"
	}
	]
	
	
});

module.exports=mongoose.model("user_item",user_items);