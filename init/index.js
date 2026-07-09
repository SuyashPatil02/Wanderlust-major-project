const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing");

const MONGODB_URI = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    console.log("Existing listings deleted");

    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6a426eca14abc0a0e74eece5" }));

    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

initDB();