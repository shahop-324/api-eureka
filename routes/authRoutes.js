const express = require("express");
const passport = require("passport");

const router = express.Router();
//authenticate requests for google

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  function (req, res) {
    console.log(req, res);
    // console.log(req.user, req.isAuthenticated());
    req.session.save(function (err) {
      res.status(301).redirect("https://www.evenz.in/search-events");
    });
  }
);
module.exports = router;
