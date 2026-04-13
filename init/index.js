//database initialization ka pura logic
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: '../.env' }); // Adjust path to find your .env file
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const dbUrl = process.env.ATLASDB_URL;
//ceate database
main().then(()=>{
    console.log("connected to db");
    initDB();
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(dbUrl);
}


//function to initialize db
const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner : "69bd5b2ffb7527cd2dcc9f24"})); //map property creates a new array and in that new array it inserts the new property to be added like herre owner for each listing
    await Listing.insertMany(initData.data);//object madhla data like referenece module.exports = { data: sampleListings };
    console.log("data was initialized")
};

