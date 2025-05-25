const express  = require("express");
const authRoutes = require("../complete-login/routes/authRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const keys = require("../complete-login/keys");
const passport =require("passport");
require("../complete-login/passport-setup");

mongoose.connect(keys.mongodb.MONGOURL).then(()=>{
    console.log("db connected");
});
const app  = express();

app.set("view engine",'ejs');


app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net");
  next();
});



app.use(session({
  secret: "your-secret-key", 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
  }
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.get("/",(req,res)=>{
    res.render('home');
})

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth",authRoutes);


app.get("/profile", (req, res) => {
  res.render("profile",  {user: req.session.user });
});


app.listen(3000,()=>{
    console.log("backend connected....")
})
