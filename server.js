const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
const session=require("express-session");
const User=require("./models/User.js");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const wrapAsync = require("./public/util/WrapAsync.js");
const MONGO_URL="mongodb://127.0.0.1:27017/Event1";
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=> {
    console.log(err)});
// main fxn to connect to DB
async function main() {
    await mongoose.connect(MONGO_URL);
}
const sessionOptions={
    secret:"BMSCE",
    resave:false,
    saveUninitialized: true,
    Cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        
    },
};
app.use(session(sessionOptions));
app.use(express.json()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// signup
app.post("/signup",wrapAsync(async(req,res)=>{
    let { username,email,password}=req.body;
    const newuser=new User({username,email,password});
    const registereduser=await User.register(newuser,password);
    console.log(registereduser);
    res.redirect("/login");
}));
app.get("/signup",(req,res)=>{
    res.render("../views/signup.ejs")
})

// login
app.get("/",(req,res)=>{
    res.render("../views/landing.ejs");
})

app.post("/login",passport.authenticate('local',
    { failureRedirect: '/login' }),async(req,res)=>{
        res.redirect("/home");
})
app.get("/login",(req,res)=>{
    res.render("../views/login.ejs");
})
app.get("/logout",(req,res)=>{
    res.redirect('/');
})
app.get("/home",(req,res)=>{
    if(!req.isAuthenticated()){
        console.log("Log in first");
        return res.redirect("/login");
    }
    res.render('../views/home.ejs');
})
app.get("/donate",(req,res)=>{
    res.render('../views/donate.ejs');
})
app.get("/comm",(req,res)=>{
    res.render('../views/comm.ejs');
})
app.get("/alerts",(req,res)=>{
    res.render('../views/alerts.ejs');
})
app.get("/aboutus",(req,res)=>{
    res.render('../views/aboutus.ejs');
})
app.get("/helpline",(req,res)=>{
    res.render('../views/helpline.ejs');
})
app.listen(8080,()=>{
    console.log("server is running");
})
