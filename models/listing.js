// will create a schema first later export it 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");


//Listing table (collection) madhe ky content asnar ahe te listingSchema madhe store kelay
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    // image : {
    //    type :String,
    //    default:"https://unsplash.com/photos/brown-house-beside-body-of-water-hBh9JbyeCtg",//image doesnt exist but for tsting purpose there shoudld be some image in that case default image is used
    //    set : (v)=> v === ""? "https://unsplash.com/photos/brown-house-beside-body-of-water-hBh9JbyeCtg":v//ternary operator(jyaveli image asel pn ti empty asli tr hi image show honar,image hai par link empty hai)
    // },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
    },
    geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
        required: true
    }
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
    
});

//listing nava model i.e collection create kela ahe
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;


