const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;


const geocodingClient= mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm =(req,res) =>{
        res.render("listings/new.ejs");

    }
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",
        populate: {
            path : "author",
        }
    })
    .populate("owner");
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    //     req.flash("error","Listing you request for does not exist!");
    //    return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}

module.exports.createNewListing = async (req,res,next) => {

    let coordinate = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send();


    const newListingData = {...req.body.listing };
    newListingData.image = {
        filename: req.file.filename,
        url: req.file.path
    };
    const newListing = new Listing(newListingData);
    newListing.owner = req.user._id;
    newListing.geometry = coordinate.body.features[0].geometry;//hi coordinates chi value mapbox madhun yetiye
    let savedListing = await newListing.save();
    console.log(savedListing);
    delete req.session.redirectUrl;
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.rendereditForm = async (req,res)=>{
    let { id }= req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    if (!listing) {
        req.flash("error","Listing you request for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = '';
    if (listing.image && listing.image.url) {
      const url = listing.image.url;
      if (url.includes('res.cloudinary.com')) {
        // Cloudinary
        originalImageUrl = url.replace('/upload/', '/upload/c_fill,w_250,f_auto/');
      } else if (url.includes('images.unsplash.com')) {
        // Unsplash
        const separator = url.includes('?') ? '&' : '?';
        originalImageUrl = url + `${separator}w=200&fit=crop`;
      } else {
        originalImageUrl = url;
      }
    } else {
      originalImageUrl = 'https://via.placeholder.com/250x200?text=No+Image';
    }
    console.log('Transformed preview URL:', originalImageUrl);
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res) => {
             if (!req.body.listing){
                throw new ExpressError(400,"Send valid data for listing")
            }
            let { id } = req.params;

            const updateData = { ...req.body.listing };
            let listing=await Listing.findByIdAndUpdate(id, updateData);

            if(typeof req.file != "undefined"){
                let url = req.file.path;
                let filename = req.file.filename;
                listing.image = {url,filename};
                await listing.save();
            }
            // // Convert image string to object with filename and url
            // if (req.body.listing.image) {
            //     updateData.image = {
            //         filename: req.file.filename,
            //         url: req.file.path
            //     };
            // }
            
            req.flash("success","Listing Updated Successfully!");
            res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
            let { id } = req.params;
            let deletedListing = await Listing.findByIdAndDelete(id);
            console.log(deletedListing);
            req.flash("success","Listing Deleted");
            res.redirect("/listings");
        }
module.exports.index = async (req, res) => {
    const { category,search } = req.query; 
    console.log("Category received:", category);
    console.log("Search query received:", search);
    let allListings;

    if (category) {
        // This is the part that filters!
        allListings = await Listing.find({ category: category });
    } else if(search){
        // Use Regex to search in both Title and Location
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    }
    else {
        allListings = await Listing.find({});
    }

    res.render("./listings/index.ejs", { allListings });
};