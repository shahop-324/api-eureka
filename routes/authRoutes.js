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
//callback request after authentication from google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//authenticate requests for facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
  })
);
//callback request after authentication from facebook
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//authenticate requests for linkedin
router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    state: "SOME STATE",
  })
);
//callback request after authentication from linkedin
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
