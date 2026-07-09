if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing");
const User = require("../models/user");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
}

const initDB = async () => {
    await Listing.deleteMany({});

    let seedUser = await User.findOne({ username: "demo-owner" });
    if (!seedUser) {
        seedUser = new User({ username: "demo-owner", email: "demo-owner@example.com" });
        await User.register(seedUser, "DemoOwner@123");
    }

    const seededListings = initdata.data.map((obj, index) => ({
        ...obj,
        owner: seedUser._id,
        isFeatured: index < 6,
    }));

    await Listing.insertMany(seededListings);
    console.log("Data initialized successfully");
};

main()
    .then(initDB)
    .catch((err) => console.error(err))
    .finally(() => mongoose.connection.close());
