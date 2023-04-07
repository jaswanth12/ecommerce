var mongoose=require("mongoose");
var reviewSchema = new mongoose.Schema({
	 id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
	username:String,
	rating:Number,
	comment:String
}); 
module.exports=mongoose.model("feedback",reviewSchema);
