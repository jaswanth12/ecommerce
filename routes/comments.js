var mongoose=require("mongoose");
var express=require('express');
var router  = express.Router({mergeParams: true});
var passport = require("passport");
var user = require("../models/user");
var product=require("../models/comments");
var review=require("../models/review");
var cartlist=require("../models/cart");
var cartitm=require("../models/cart2");
var feedback=require("../models/review");
var middleware=require('../middleware');
router.post("/products/:type/:id/comment",middleware.isLoggedIn,function(req,res){
//	console.log("########");

	product.find({_id:req.params.id},function(err,userw){
		if(err){
			console.log("error in finding products");
			return res.render("/",{"error":err.msg});
		}
		else{
	//console.log(userw);			
			review.create({id:req.user._id,username:req.user.username,rating:req.body.rating,comment:req.body.comment},function(err1,reviewitemaa){
				if(err1){
					console.log("error in creating review");
					return res.render("/",{"error":err1.msg});
				}
				else{
	//				console.log("review created succefully");
					userw[0].feedbacked.push(reviewitemaa);
               		userw[0].save(function(fail,suc){
				   		if(fail){
					   		console.log("fail");
							return res.render("/",{"error":fail.msg});
				   				}
						//console.log(suc);
			   		});
              }
			});
		}
	});/*
	product.findOne({_id: req.params.id}, function(err, usered){
    if(err){
        // console.log(err);
    } else {
	//	console.log("this is boy req");
		//console.log(req.body);
        usered.reviews.push({
			id:req.user._id,
            username:req.user.username,
			rating: req.body.rating,
            comment: req.body.comment
        
		});
		//console.log("this is users"+req.user._id);
        usered.save(function(err, user){
            if(err){
                //console.log(err);
            } else {
              //  console.log(user);
            }
        });
    }
});*/
	 req.flash('success', 'comment has created succefully');
	res.redirect("/products/"+req.params.type+"/"+req.params.id);

});
router.get("/products/:type/:id/comment/new",middleware.isLoggedIn,function(req,res){
	//console.log(req.params);
 var category=req.params.type;
	var ide=req.params.id;
	var sending={category,ide}
	res.render("commenting_item.ejs",{pitem_ide:sending});
});
router.get("/products/:type/:id/comment/:cid/edit",middleware.isLoggedIn,function(req,res){
	console.log("the data is");
	var obj={ptype:req.params.type,pid:req.params.id};
	feedback.find({_id:req.params.cid},function(err,suc){
		if(err){
			console.log("err");
		}
		else{
			console.log(suc);
				 res.render("comment_edit.ejs",{hello:suc[0],pitem:obj});
		}
	});	
	//res.render("comment_edit.ejs");
	
});
router.put("/products/:type/:id/comment_edit/:ide",middleware.isLoggedIn,function(req,res){
	console.log(req.body);
	feedback.findByIdAndUpdate(req.params.ide,req.body.review,function(err,suc){
		if(err){
			console.log("error");
		}
		else{
			console.log(suc);
		}
	});
	req.flash("success", "comment edit was success");
	res.redirect("/products/"+req.params.type+"/"+req.params.id);
	
	
});
router.delete("/products/:type/:id/deletecomment/:ide",function(req,res){
	console.log(req.params.ide);
	review.findOneAndDelete({_id:req.params.ide},function(err,res){
		if(err){
			console.log("errored");
			req.flash("error", "delete operqation failed");
			return res.render("/",{"error":"deleteion failed"});
		}
		else{
			console.log("deleted");
			//console.log(res);
	
		}
	});
	req.flash("success", "deleted successful");	
	res.redirect("/products/"+req.params.type+"/"+req.params.id);
	
});

module.exports=router;