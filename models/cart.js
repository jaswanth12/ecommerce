var mongoose=require('mongoose');
var cartitm=require('../models/cart2');

var mycartlist = new mongoose.Schema({
	userid:{
		    type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        
	},
	username:String,
	cartitems:[
	{
		 type: mongoose.Schema.Types.ObjectId,
         ref: "cartitm"
		//ref:"mycartitems"
	}
	]
		/*{
			productid:{
			type: mongoose.Schema.Types.ObjectId,
            ref: "product"
			},
			pname:String
		}*/
	//]
	
});
module.exports=mongoose.model("cartlist",mycartlist);
