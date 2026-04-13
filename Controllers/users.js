const User = require("../models/user.js")
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res) => {
    try{
        let {username , email ,password } = req.body
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=> {
            if(err){
                return next(err);
            }
            req.flash("success","User was Registered");
            res.redirect("/listings");
        })
        
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup")
    }
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome back to VistaVoyage!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);//once passport run the login middleware at up side for authentication then automatically it resets the session information so redirectUrl will get deleted which is stored before signup or login so we need to use locals to store the redirectUrl beacuse passport cannot directly delete the locals(and accessible everywhere)
}

module.exports.logout = (req,res,next)=> {
    req.logout((err)=>{ //error ha ek callback ahe it means if error occur while loggin out then an error should occur and that error is defined and it shoudld stored in callback and if error doe not occur then flash message and redirection should work
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}