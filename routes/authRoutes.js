const express = require("express");
const router = express.Router();
const { signupSchema, loginSchema } = require("../JoiValidation/validation");
const User = require("../models/User");
const {doHash, comparePassword} = require("../hashing");
const passport = require("passport");


router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Validate request body
  const { error } = signupSchema.validate({ email, password, firstName, lastName });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create and save new user
    const hashedPassword = await doHash(password,10);

    const newUser = await User.create({ email, password:hashedPassword, firstName, lastName });

    console.log("user created",newUser);
    return res.status(200).json({ success: true, message: "User signed up" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login",async (req,res)=>{
    const{email,password} = req.body;
    const {error} = loginSchema.validate({email,password});
    if(error){
        console.log(error.details[0].message);
        return res.status(400).json({
            success:false,
            message:error.details[0].message
        })
    }

    const existingUser = await User.findOne({email});

    if(!existingUser){
        return res.status(400).json({
            success:false,
            message:"user does not exists"
        })
    }

    const hashedPassword = existingUser.password;
    const comparedPassword = await comparePassword(password,hashedPassword);
    if(!comparedPassword){
        return res.status(400).json({
            success:false,
            message:"password did not matched"
        })
    }
// return res.status(200).json({success:true,message:"user logged in"});

req.session.user = {
  email: existingUser.email,
  firstName: existingUser.firstName,
  lastName: existingUser.lastName
};
req.session.save(()=>{
  res.redirect("/profile");
});

})


router.get("/facebook",passport.authenticate('facebook',{
  scope:['email']
}));


router.get("/facebook/redirect", passport.authenticate("facebook", {
  failureRedirect: "/"
}), (req, res) => {
  // Save user info into session
  req.session.user = {
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName
  };
  req.session.save(() => {
    res.redirect("/profile");
  });
});


router.get("/google",passport.authenticate('google',{
  scope:['profile','email']
}));
router.get("/google/redirect", passport.authenticate("google", {
  failureRedirect: "/"
}), (req, res) => {
  // Store user info in session
  req.session.user = {
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName
  };

  req.session.save(() => {
    res.redirect("/profile");
  });
});

module.exports = router;
