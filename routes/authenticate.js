var express=require('express');
var flash=require("connect-flash");
var router  = express.Router({mergeParams: true});
var passport = require("passport");
var user = require("../models/user");
var middleware=require("../middleware");
var cartlist=require('../models/cart');
var boughtlist=require('../models/user_items');
var mail=require('../routes/mailing.js');
var nodemailer=require('nodemailer');
var validator=require('node-input-validator');

router.get('/signup',middleware.isLoggedOut,function(req,res){
	res.render('signup.ejs');
});
router.post('/signup',function(req,res){
	if(req.body.password!=req.body.password2){
		req.flash('error', 'password do not matchs');
		return res.redirect('signup');
	}
	var newpwd=Math.random().toString(36).slice(2);
	var hi="your new passpord is "+" "+newpwd+". please use it to login";
	console.log(req.body.email);
	//var ti=mail(hi,req.body.username);
	var ti=mail(hi);
	//console.log(ti.gl);
var obj={'username':req.body.username,'password':req.body.password,'fullname':req.body.fullname};
	
	user.register(new user(obj),req.body.password,function(err,user){
		if(err){
			console.log("error found");
			   return res.render("signup",{"error":err.message});
			   }
		passport.authenticate('local')(req,res,function(){
			var obj={userid:user._id,username:user.username}
			 cartlist.create(obj, function(err, res){
				if(err){
					console.log("error in creating cart");
				}
				else{
					console.log("cart creadted");
					var mailide="120014060@sastra.ac.in";
					var hi=mail("thank you for joining us...enjoy",mailide);
					
				}
			});	
			var obj2={userid:user._id,username:user.username}
			boughtlist.create(obj2,function(err3,res3){
				if(err3){
					console.log(err3);
					console.log("error in creating items");
				}
				else{
					console.log("bought items created");
				}
				
			});
			
			 req.flash('success', 'Registration you did successfully');
          	 res.redirect("/");
		})
		
	});

});
router.get('/login',middleware.isLoggedOut,function(req,res){
	
	return res.render('login.ejs');
});
router.post('/login',passport.authenticate('local',{
		successRedirect :'/',
		failureRedirect: "/login"}),function(req,res){

});
router.get('/logout',middleware.isLoggedIn,function(req,res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});
router.get('/changepassword',middleware.isLoggedIn,function(req,res){
	res.render('changing_password.ejs');
});
router.post('/changepassword',function(req,res){
	
	if(req.body.npwd!=req.body.verify){
		return res.render("changing_password",{"error":"new and old password not match"});
	}
	else{
	user.find({username:req.user.username},function(err,cuser){
		if(err){
			console.log("error cannot find user");
		}
		else{
			console.log("password obtainded");
			console.log(cuser);
	cuser[0].changePassword(req.body.opwd,req.body.npwd,function(fail,suc){
		if(fail){
			console.log(fail.message);
			console.log("fail to update password");
			return res.render("changing_password",{"error":"old password do not match"});
			
		}
		else{
			console.log(suc);
			user.findOneAndUpdate({username:req.user.username},{password:req.body.npwd},function(er3,suc3){
				if(er3){
					console.log("error in updating");
				}
				else{
					console.log("success");
				}
				
			});
			
			
			console.log("suc"+suc);
			req.flash('success', 'changed successfully');
				 res.redirect("/");
		}
	});
			
		}
	});
}

	//res.redirect("/");
});
router.get('/resetpwd',middleware.isLoggedOut,function(req,res){
	res.render('reset_pwd.ejs');
});
router.post('/resetpwd',middleware.isLoggedOut,function(req,res){
	console.log(req.body.username);
	{
	user.find({username:req.body.username},function(err,cuser){
		if(err){
			console.log("error cannot find user");
			req.flash('error','error occured plz try again');
				return res.redirect("/");
				
		}
		else if(cuser.length==0){
			console.log("user not there");
			req.flash('error','user not found');
				return res.redirect("/resetpwd");
				}
		else{
			console.log("password obtainded");
			console.log(cuser);
			var newpw=Math.random().toString(36).slice(2);
	cuser[0].changePassword(cuser[0].password,newpw,function(fail,suc){
		if(fail){
			console.log(fail.message);
			console.log("fail to update password");
			req.flash('error','error occured plz try again');
			return res.redirect("/");
			
		}
		else{
			var txt="your new password is "+newpw+". Use it for login";
			var mailide="120014060@sastra.ac.in";
			mail(txt,mailide);
			console.log(suc);
			user.findOneAndUpdate({username:req.body.username},{password:newpw},function(er3,suc3){
				if(er3){
					console.log("error in updating");
				}
				else{
					console.log("success");
				}
				
			});
			console.log("everythinh success ");
			req.flash('success', 'email sent successfully..check your mail');
				return res.redirect("/");
		}
	});
			
		}
	});
}
	
		
});

module.exports=router;