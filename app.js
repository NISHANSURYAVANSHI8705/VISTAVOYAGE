// dotenv is a thirs party library jo hamare env file ko backend ke sath integrate karwati hein
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// require('dotenv').config();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js")//accesing model to create a document i.e new record
const path = require("path");
const methodOverride =  require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const Review = require("./models/reviews.js");
// const { listingSchema } = require("./schema.js");
// const { reviewSchema } = require("./schema.js");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);//creates a mongo store for us
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require ("./routes/review.js");
const userRouter = require("./routes/user.js")
// "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;

// main().then(()=>{
//     console.log("Connected to database")
// })
// .catch((err)=>{
//     console.log(err);
// });

async function main(){
    await mongoose.connect(dbUrl);
}

//ceate database
main().then(()=>{
    console.log("connected to db");
    //for ejs
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended : true}));
    app.use(methodOverride("_method"));
    app.use(express.json());
    app.engine('ejs', ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));
    
    //  const store = MongoStore.create({
    //     mongoUrl : dbUrl,
    //     crypto : {
    //         secret: "mysupersecretcode"
    //     },
    //     touchAfter: 24 * 3600,
    // });

    const store = new MongoStore({ // Use 'new'
    url: dbUrl, // Note: it's 'url', not 'mongoUrl'
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
});

    store.on("error",(err)=>{
        console.log("ERROR in MONGO SESSION STORE",err);
    });

    const sessionOptions = {
        store : store,
        secret :process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie: {
            expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly : true,
        }
    };

   

    //route checking
    // app.get("/",(req,res)=>{
    //     res.send("Hii i am home page");
    //     console.log("responded");
    // })
    // in order to apply local strategy we need session that willl be used by passport like when user logged in to any website then he will be having same login so website should not asked for multiple times login to same user in one session while surfing the website
    app.use(session(sessionOptions));
    app.use(flash());

    //configuring strategies

    // har ek request ke liye hamara passport initialize ho jayega
    // a middleware that initializes passport
    app.use(passport.initialize());
    app.use(passport.session());//a web application needs the ability to identify user as they browse from page to page .this series of requests and responses ,each associated with same user,is known as a session
    passport.use(new LocalStrategy(User.authenticate()));//use static authenticate method of model in LocalStrategy,and authenticate() generates a function that is used in passports LocalStrategy
    passport.serializeUser(User.serializeUser());//to store user info into the session like once he login then to store the login credentials int the session so website dont ask him for the login cred again
    passport.deserializeUser(User.deserializeUser());//to unstored the info from session

    //middleware
    app.use((req,res,next)=>{
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.CurrUser = req.user;
        next();
    });
    
    // app.get("/demouser", async(req,res) => {
    //     let fakeUser = new User ({
    //         email:"student@gmail.com",
    //         username:"sigma-student"
    //     });
    //     let registeredUser = await User.register(fakeUser,"HelloWorld"); //helloWorld is password of fakeuser
    //     //syntax:
    //     //register(user,password,cb) : convinience method to register a new user instance with a given password.checks if username is unique
    //     res.send(registeredUser);
    // });


    app.get("/health", (req, res) => {
        res.status(200).send("OK");
    });

    app.use("/listings",listingRouter);
    app.use("/listings/:id/reviews",reviewRouter);
    app.use("/",userRouter);
   

    //page not found response
   // Page Not Found handler (must be AFTER all routes)
    app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

    //ERROR HANDLING MIIDLEWAE
    app.use((err, req, res, next) => {
        let {statusCode = 500 , message = "Something went wrong"} = err;
        // res.status(statusCode).send(message);
        res.status(statusCode).render("error.ejs", { message,stack: err.stack });
    })

    //connected to localhost
    app.listen(8080, () =>{
        console.log("server is listening to port 8080");
    });
}).catch((err)=>{
    console.log(err)
})

app.get("/testListing",async(req,res)=>{
    let sampleListing = new Listing({ //create one sample listing
        title : "My New villa",
        description : "Located near to lake",
        price:1200,
        location : "Calangut , Goa",
        country : "India"
    });
    await sampleListing.save();
    console.log("Sample was saved in db");
    res.send("Succesfull");
});
