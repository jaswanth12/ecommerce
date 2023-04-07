var express=require('express');
var router  = express.Router({mergeParams: true});
var cartlist=require("../models/cart");
var cartitm=require("../models/cart2");
var boughtitem=require("../models/user_items");
var bitems=require("../models/bought_items");
var middleware=require('../middleware');
var product=require("../models/comments");
router.get("/cart",middleware.isLoggedIn,function(req,res){
	cartlist.find({userid:req.user._id}).populate("cartitems").exec(function(fail,suc){
		if(fail){
			console.log("failed");
			res.redirect("/");
		}
		else{console.log(suc[0].cartitems);
		}
	var obj=suc[0].cartitems;
	res.render("carting.ejs",{items:obj});
	});
	
	
});
router.post("/cart/:idee",middleware.isLoggedIn,function(req,res){

	/*	cartlist.findOneAndUpdate({userid:req.user._id},
								   { $push: {cartitems:{productid:req.params.idee,pname: req.body.productname}} },function(err,res2){
									if(err){console.log("error in cart append");}
									else{
										console.log("hello testing");
										console.log(res2);
										}});
	*/
	 cartlist.find({userid:req.user._id}).populate("cartitems").exec(function(err, campground){
       if(err){
           console.log(err);
           //res.redirect("/campgrounds");
       } else {
		  console.log("success indentifes");
		   console.log(campground[0].cartitems);
		   var count=0;
		   for(var i=0;i<campground[0].cartitems.length;i++){
			   if(campground[0].cartitems[i].pid.equals(req.params.idee)){
			   		console.log(campground[0].cartitems[i].pid);
				   console.log(req.params.idee);
				   count=count+1;
			   console.log(count);
		   }
		   }
		   if(count==0){
			 cartitm.create({useride:req.user._id,pid:req.params.idee,pname:req.body.productname,pquantity:1}, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   console.log("cartitm created");
		//		console.log(campground[0]);   
			//   console.log(comment);
			   
		      campground[0].cartitems.push(comment);
               campground[0].save(function(fail,suc){
			//	   console.log(suc);
			   });
              
           }
        });  
		   }
		   else{
			   var qty=1;
			   cartitm.find({useride:req.user._id,pname:req.body.productname},function(er1,res1){
				   if(err){console.log("erroe");}
				   else{console.log(res1[0]);
					   qty=res1[0].pquantity;
				qty=qty+1;
			  var update={pquantity:qty};
				   
					   cartitm.findOneAndUpdate({useride:req.user._id,pname:req.body.productname},update,function(er2,res2){
				if(er2){
					console.log("err2");
				}
				else{
					console.log(res2);
					console.log("hurray");
				}
			});
					   
					   
					   
					   }
			   });
			   
		   
		   }
		   
          //console.log(campground);
		   
		   
       }
   });
		res.redirect("/cart");
});
router.delete("/cart/:idee",middleware.isLoggedIn,function(req,res){
	cartitm.findOneAndDelete({_id:req.params.idee},function(err,res){
		if(err){console.log(err);}
		else{console.log("deleteed");}
	});
	req.flash('success', 'item removed from cart');
	res.redirect("/cart");
});
router.delete("/cart/:idee/buy",middleware.isLoggedIn,function(req,res){
	cartitm.findOneAndDelete({_id:req.params.idee},function(err,res){
		if(err){console.log(err);}
		else{console.log("deleteed");}
	});
	req.flash('success', 'successfully done');
	res.redirect("/cart");
});
router.post("/boughtitem",middleware.isLoggedIn,function(req,res){
	
	
	boughtitem.find({userid:req.user._id},function(er1,res1){
		if(er1){
			console.log("error in finding the bought list");
		}
		else{
		console.log(res1);		
		console.log(req.body);
	var bitem=req.body;
	
			
			bitems.create({useride:req.user._id,pid:bitem.productid,busername:bitem.busername,buserpno:bitem.buserpno,buseradd:bitem.buseradd},function(er2,res2){
		if(er2){
			console.log("bitems not created");
		}
		else{
			
			console.log("bitems created succesfully");
			res1[0].boughtitems.push(res2);
			res1[0].save(function(fail,suc){
				if(fail){
					console.log("failed");
				}
				else{
					//console.log(suc);
					console.log("success");
					req.flash('success', 'item bought successfully');
				}
			})
		}
	});
	
	
		
		}
		
	});
	res.redirect("/mybookeditems");
});
router.get("/mybookeditems",middleware.isLoggedIn,function(req,res){
	boughtitem.find({userid:req.user._id}).populate("boughtitems").exec(function(err, campground){
		if(err){
			console.log("error in display booked products");
			res.redirect("/");
		}
		else{
			console.log(campground[0]);
		res.render("display_buyed_products.ejs",{mybookeditems:campground[0].boughtitems});		
		}
		
	});
	
	
});
router.get("/mybookeditems/:ide",middleware.isLoggedIn,function(req,res){
	obj=req.params.ide;
	console.log(obj);
	bitems.findOne({_id:obj},function(er1,re1){
		if(er1){
			req.flash('error','try again some thing went wrong');
			res.redirect("/mybookeditems");
		}
		else{
			//console.log(re1);
			product.findOne({_id:re1.pid},function(er2,res2){
				if(er2){
					res.redirect("/mybookeditems");
				}
				else{
			res.render("viewing_buyed_item.ejs",{bougthitem:re1,boughtproduct:res2});					
				}
				
			});
		
		
		}
	});
	
});
router.get("/buyitem/:idee",middleware.isLoggedIn,function(req,res){
	product.findOne({_id:req.params.idee},function(er,res){
		if(er){
			console.log(er);
		}
		else{
			console.log(res);
		}
	});
	
	res.render("buying_item.ejs",{productitem:req.params.idee});	
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		
		res.redirect("/login");
	}
}
module.exports=router;