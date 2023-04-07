var express=require('express');
var router  = express.Router({mergeParams: true});
var product=require('../models/comments');
var category=require("../models/category");
router.get('/addproduct',function(req,res){
	
	
product.find({},function(err,products){
if(err){console.log('error');}
	else{
		console.log("**********add products page**********");
		//console.log(products);
	res.render("addproduct.ejs",{hello : products});
		//res.render("products_category.ejs",{hello : products,cname:category_name});
	}
	
});
	
	
});

router.post('/addproduct',function(req,res){
	console.log(req.body);
	//var id=req.body.productid;
	var category1=req.body.productcat;
	var pname=req.body.productname;
	var pprice=req.body.productprice;
	var image=req.body.productimg;
	
	var newobj={category:category1,pname:pname,pprice:pprice,image:image};
	//products.push(newobj);
	product.insertMany([newobj],function(err,item){
	if(err){
		console.log("error occured");
	}
	else{
		console.log(item);
	}
	
	
});
	category.find({},function(err,categories){
var name=req.body.productcat;
	var flag=0;
	if(err){console.log('error');}
	else{
		console.log("catogries are");
		for(var i=0;i<categories.length;i++){
			if(categories[i].cname==name){
				flag=1;
			console.log("exists");
				break;
			}
		}
		if(flag==0){
			category.insertMany([{cname:name,cimage:"cap.jpg"}],function(err,cat){
					if(err){console.log("error in category schema");}
						else{console.log("success"+cat);}
});
		}
	}
});
	var product_type="others";
	req.flash("success", "pro added successfully");
	res.redirect("/addproduct");
});

module.exports=router;