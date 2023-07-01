const mongoose = require("mongoose");

const connection = () => {

    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
};

module.exports = connection;
