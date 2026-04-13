const Review= require("../models/reviews");
const Listing = require("../models/listing")
module.exports.createReview = async(req,res)=> {
        let listing = await Listing.findById(req.params.id);//this will find the particular listing as per id passed
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        // console.log("new Review Saved");
        // res.send("new Review Added")
        req.flash("success","New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    }

module.exports.destroyReview = async(req,res)=>{
        let {id ,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}} );
        // Listing schema madhe ek reviews navacha array ahe tyamadhe ji review ,reviewId barobar match hoil tila pill means array madhun dlete karun takaycha ahe
    
        // listing ke andar ek review array hein usmein bhi reviews ke object id store hein to usko bhi delete karna hoga
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted");
        res.redirect(`/listings/${id}`);
    
}