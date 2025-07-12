const mongoose = require("mongoose");


const connectDB = async() => {
    try {
        const conn = await mongoose.connect("mongodb+srv://sitobookingfondamentiweb:booking2025@cluster0.qp0xcga.mongodb.net/SitoBooking?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`Connesso al Database!!!`)
    } catch (err){
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;