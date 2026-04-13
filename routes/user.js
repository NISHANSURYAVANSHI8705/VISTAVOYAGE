const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const usersController = require("../Controllers/users.js")
router.route("/signup")
    .get(usersController.renderSignUpForm)
    .post(wrapAsync(usersController.signup));

router.route("/login")
    .get(usersController.renderLoginForm)
    .post(saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect : "/login", 
    failureFlash: true}), 
    usersController.login);

//get route for logout
router.get("/logout",usersController.logout)
module.exports = router;
//get route for signup
// router.get("/signup",usersController.renderSignUpForm);

//post route for signup
// router.post("/signup", wrapAsync(usersController.signup));

//get route for login
// router.get("/login",usersController.renderLoginForm);

//post route for login
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//     failureRedirect : "/login", 
//     failureFlash: true}), 
//     usersController.login);

