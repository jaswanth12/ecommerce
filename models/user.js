var mongoose=require('mongoose');
var localmongoose=require('passport-local-mongoose');
var userSchema= new mongoose.Schema({
	username:String,//emial
	password:String,
	fullname:String//users full name
});  //test
userSchema.plugin(localmongoose);
module.exports=mongoose.model('user',userSchema);