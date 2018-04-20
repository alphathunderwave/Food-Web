var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    =  require("../models/user");
var nodemailer = require("nodemailer");


//AUTH ROUTES

//SHOW REGISTER FORM

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/about", function(req, res){
    res.render("about");
});


router.get("/register",function(req,res){
   res.render("register",{page:'register'});
});

// Handle Sign Up Logic

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/dishes");
        });
    });
});

//show Login Form

router.get("/login", function(req, res) {
   res.render("login",{page:'login'});
});

//Handling Logic
router.post("/login", passport.authenticate("local",
{
    successRedirect:"/dishes",
    failureRedirect:"/login",
    successFlash: "Welcome",
    failureFlash: "Invalid Username or Password"
}),function(req,res){

});

//show Forgot Form
// create reusable transport method (opens pool of SMTP connections)


router.get("/forgot", function(req, res) {
   res.render("forgot",{page:'forgot'});
});

//Handling Logic
router.post("/register", function(req, res){
  //this email form needs to be filled out for the email to work
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "gmail.user@gmail.com",
          pass: "userpass"
      }
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
      to: req.body.email, // list of receivers
      subject: "Forgot Password ✔", // Subject line
      text: "It seems that you have forgot your password ✔", // plaintext body
      html: "<a href='/reset'>let's reset it ✔</a>" // html body
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });

});
router.get("/reset",function(req,res){
   res.render("register",{page:'register'});
});

// Handle Sign Up Logic

router.post("/reset", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Changed password " + req.body.username);
           res.redirect("/dishes");
        });
    });
});



//LOGOUT ROUTE

router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/dishes");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;
