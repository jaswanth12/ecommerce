var mongoose=require('mongoose');
var mycartitems = new mongoose.Schema({
	useride:{
		    type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        
	},
	pid: {
		  type: mongoose.Schema.Types.ObjectId,
            ref: "product"
	 },
	pname:String,
	pquantity:Number
	
}); 
module.exports=mongoose.model("cartitm",mycartitems);