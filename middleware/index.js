
var middleware={};
middleware.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash('error', 'please login')
		return res.redirect("/login");
	}
}
middleware.isLoggedOut=function(req,res,next){
	if(req.user){
		return res.redirect("/");
	}
	else{
		return next();
	}
	
}
module.exports=middleware;