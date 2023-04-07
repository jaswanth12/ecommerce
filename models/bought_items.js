var mongoose=require('mongoose');
var boughtitems = new mongoose.Schema({
	useride:{
		    type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        
	},
	pid: {
		  type: mongoose.Schema.Types.ObjectId,
            ref: "product"
	 },
	busername : String,
	buserpno : Number,
	buseradd : String
});
module.exports=mongoose.model("boughtitem",boughtitems);