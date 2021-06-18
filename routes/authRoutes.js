const express = require("express");
const passport = require("passport");

const router = express.Router();
//authenticate requests for google

router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: ["profile", "email"],
    }
  )
);

router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),
(req,res)=>{

  res.redirect('/eureka/v1/registration/generalIntent');
}

)
module.exports=router;

