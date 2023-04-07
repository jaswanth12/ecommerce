var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var passport=require('passport');
var localStratergy=require('passport-local');
var methodOverride=require('method-override');
var category=require('./models/category.js');
var user=require('./models/user.js');
var cartlist=require('./models/cart.js');
var cartitm=require('./models/cart2.js');
var product=require('./models/comments.js');
var review=require('./models/review.js')
var authentications=require('./routes/authenticate');
var addingproducts=require('./routes/addingproduct');
var commenting=require('./routes/comments');
var carting=require("./routes/carting");
var nodemailer = require('nodemailer');
var otp=0;
//for the flash message
var session = require('express-session');
var cookieParser = require('cookie-parser')
var flash=require("connect-flash");
//
var middleware=require('./middleware');
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(flash());
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/products", { useNewUrlParser: true })
/*defining the schemea*/
var url=require("url");

//initializing the express-sessions
app.use(require('express-session')({
		secret:'I am jaswanth',
		resave:false,
		saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(function(req,res,next){
	res.locals.currentuser=req.user;
	res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
	next();
	
});
app.use(authentications);
app.use(addingproducts);
app.use(commenting);
app.use(carting);
app.get("/",function(req,res){
	{//console.log(req.flash("error"));
	//console.log(req.flash("success"));
	var hel="hello how are u";

		//req.session.message="hi";
	//console.log(req.session);
	//console.log(req.flash("success"));
	//console.log(req.flash("error"));
//console.log(typeof Math.random().toString(36).slice(2));
	}
	if(req.user){
		console.log("user logged in");
		console.log(req.user);
		/*cartlist.findOneAndUpdate({userid:req.user._id},
								   { $push: {cartitems:{productid:"hey",pname: "joy"}} },
								  function(err,res){
									if(err){console.log("error in cart append");}
									else{
										console.log("hello testing");
										console.log(res);
										}});
		
	*/
		/* cartlist.find({userid:req.user._id}, function(err, campground){
       if(err){
           console.log(err);
           //res.redirect("/campgrounds");
       } else {
		   
		   console.log("success indentifes");
        cartitm.create({pid:"hey",pname:"hello"}, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   console.log("cartitm created");
				console.log(campground[0]);   
			   console.log(comment);
			   
		      campground[0].cartitems.push(comment);
               campground[0].save(function(fail,suc){
				   console.log(suc);
			   });
              
           }
        });
       }
   });
		
	*/cartlist.find({userid:req.user._id}).populate("cartitems").exec(function(fail,suc){
		if(fail){console.log("failed");}
		else{console.log(suc[0]);}
	
	});
	}
	else{
		console.log("logged ut");
	}
	res.render("home.ejs");
	
});
app.get("/update",middleware.isLoggedIn,function(req,res){
	//console.log(req.user);
	res.render("update_pass.ejs",{userdet:req.user});
});
app.post("/update",function(req,res){
	
	
	
	/*user.findOneAndUpdate({username:req.user.username},{salt:req.body.newpassword},function(err,res){
		if(err){
			console.log("error occured");
			
		}
		else{
			console.log("successfully created");
			req.logout();
			
		}
		
	});
	console.log(req.body);
		res.redirect("/");*/
});
//carting-3 routes
app.get("/success",function(req,res){
	res.render("success_page.ejs",{hello:"success fully updataed"});
});
app.get("/products",function(req,res){
category.find({},function(err,ans){
	if(err){
		//console.log(err);
	}
	else{
		res.render("products.ejs",{hello : ans});
	}
	
});	
	
	

	
});

function random(){
	var otp=0;
	var x,y;
	var d=new Date();
	x=(((432*d.getFullYear()+d.getHours())+d.getMilliseconds()%d.getMinutes()+d.getSeconds()));
	x=(d.getHours()+x+Math.floor(Math.random()*1000));
x=x+Math.floor(Math.random()*1000);
	otp=x%10000;
	console.log(otp);
	return otp;
}

app.post("/generateotp",function(req,res){
	

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   // user: '120014060@sastra.ac.in',
    //pass: '8125547138Sk'
  }
});

var otp1=random();
var mailOptions = {
  from: 'jayy31052@gmail.com',
  to: '120014060@sastra.ac.in',
  subject: 'Sending Email using Node.js',
  text: "otp is "+otp1+' '
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
  //  console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
	otp=random();
	console.log(otp);
	res.redirect("/otpform");
});

app.get("/otpform",function(req,res){
	res.render("mailinged.ejs");
});
app.post("/otpform",function(req,res){
	var ans="the final otp is"+otp+"b";
	console.log(req.body.otp);
	console.log(Number(req.body.otp));
	
	if(otp===Number(req.body.otp)){
	return res.send(ans);	
		console.log(otp);
		console.log(Number(req.body.otp));
		console.log("suc");
	}
	//res.send("failure");
	res.redirect("/otpform");
	
});

app.get("/products/:type",function(req,res){
		var category_name=req.params.type;
	console.log(req.url);
	var obj=url.parse(req.url,true).query;
	console.log(typeof obj.sorting	);
	console.log(req.params);
	console.log(req.body);
	if(obj.sorting=="byprice"){
		var query=product.find({category:category_name});
		query=query.sort("field pprice");
		query.exec(function(err,products){
		if(err){console.log("error");}
		else{
			console.log(products);
			res.render("products_category.ejs",{hello : products,cname:category_name});
		}
	});
	}
	else if(obj.sorting=="byname"){
		var query=product.find({category:category_name});
		query=query.sort("field pname");
		query.exec(function(err,products){
		if(err){console.log("error");}
		else{
			console.log(products);
			res.render("products_category.ejs",{hello : products,cname:category_name});
		}
	});
		
	}
	else
	{
		product.find({category:category_name},function(err,products){
		if(err){console.log('error');}
		else{
			res.render("products_category.ejs",{hello : products,cname:category_name});
			}
		});
	}

});
app.post("/products/:type",function(req,res){
	//console.log(req.body);
	res.send("okay");
});

app.get("/products/:type/:id",function(req,res){
	var ide=req.params.id;
	product.findOne({_id:ide}).populate("feedbacked").exec(function(err,pro){
		if(err){console.log('error');
			   res.redirect("/");
			   }
		else{
			console.log("product items are:");
			console.log(pro);	
			console.log(pro.feedbacked[0]);
			res.render("products_item.ejs",{pitem_ide : pro});
		
		}
		
	});
	

});

app.get("/products/:type/:id/edit",function(req,res){
	
	product.find({_id:req.params.id},function(err,pro){
	if(err){
		console.log("error occured");}
	else{
	res.render("products_item_edit.ejs",{hello:pro[0]});	}
	
	});
	
});

app.delete("/products/:type/:id",function(req,res){
	
	//console.log(req.params.id);
	   product.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.send("<h1>try again</h1>");
       } else {
        res.redirect("/products/"+req.params.type);
       }
   });
	
});

//comment session
app.put("/products/:type/:id",function(req,res){
	
	product.findByIdAndUpdate(req.params.id,req.body.item,function(err,updated_value){
		if(err){
			console.log("error");
		}
		else{
				
			//res.send("success");
			//console.log(updated_value.category);
			//console.log(updated_value.pname);
			res.redirect("/products/"+req.params.type+"/"+req.params.id);
		}
	});
});
//adding product
//authentication
app.get("*",function(req,res){
	res.render("error_page.ejs");
});
app.listen(3002, function() { 
  console.log('Server listening on port 3002'); 
});