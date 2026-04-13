const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")//accesing model to create a document i.e new record
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../Controllers/listing.js");
const multer  = require('multer') //form ke dta ko parse karne ke liye hum multer use kar rahe hein
const {storage} =  require("../CloudConfig.js");
const upload = multer({ storage }) //multer will remove or take file from form data and will save or store it in uploads folder(i.e in cloudinary storage folder)

// ab hamara form file data ko backend mein send karega ,multer uss data ko parse karega backedn mein and wo data hamare cloudinary wale account mein jake save bhi ho jayega


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn ,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createNewListing));
    //listing image madhun ji single image yetiye ti upload folder madhe upload jhali pahije
   
//NEW Route,middleware named isLoggedIn pass kela ahe
    router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
    .put(isLoggedIn,isOwner,
            upload.single('listing[image]'),
            validateListing,
            wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing ))
    .get(wrapAsync(listingController.showListing));



//  index route -- to show all listings i.e list of places or houses
    // router.get("/",wrapAsync(listingController.index));



//show Route
    // router.get("/:id", wrapAsync(listingController.showListing));

//create route -- new form submit jhalyvar te listings madhe add jhala pahije,as we are making changes in databases so we need to make the function of async type
// router.post("/",isLoggedIn ,validateListing,wrapAsync(listingController.createNewListing));
    
//Edit Route--serves form for us
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.rendereditForm));
    
//update Route
// router.put("/:id",isLoggedIn,isOwner,
//             validateListing,
//             wrapAsync(listingController.updateListing));
    
 //DELETE route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing ));

module.exports = router;
    