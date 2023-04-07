var nodemailer=require('nodemailer');
function main(ffie,mailide){
	var gl;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '120014060@sastra.ac.in',
    pass: '8125547138Sk'
  }
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
var otp1=random();
var mailOptions = {
  from: 'jayy31052@gmail.com',
  to: mailide,
  //to:'120014060@sastra.ac.in',
  subject: 'Sending Email using Node.js',
  text: " "+ffie+' '
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log("error");
	gl="error";  
  } else {
    console.log('Email sent: ' + info.response);
  gl="success";
  }
});


}
module.exports=main;