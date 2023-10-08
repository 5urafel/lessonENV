//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;


const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = mongoose.Schema({
  name:String ,
  password:String
});



const User = mongoose.model("User",userSchema);

app.get("/",function (req,res) {
  res.render("home")
});

app.get("/login",function (req,res) {
  res.render("login")
});

app.get("/register",function (req,res) {
  res.render("register")
});

app.post("/register",function (req,res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUser = new User({
        name : req.body.username,
        password:hash
      });
    newUser.save().then(function (successCB,errorCB) {
      if (successCB) {
        res.render("secrets")
      }
      else {
        console.log(errorCB);
      }
    });

  });


});

app.post("/login",function (req,res) {
  const email= req.body.username;
  const password=req.body.password;

   User.findOne({name : email}).then(function (successCB,errorCB) {
    if (errorCB) {
      console.log(error)
    }
    else {
      if (successCB) {
        bcrypt.compare(password, successCB.password, function(err, result) {
    // result == true
          if (result===true) {
            res.render("secrets");
          }
          else {
            console.log("password does not match");
          }
        });    
      }
      else {
        console.log("not registerd");
      }

    }
  })
})


app.listen(3000,function () {
  console.log("server is listening on port 3000");
})
