const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB Connected to ${process.env.DB_NAME}`);
    } catch (error) {
        console.error('MongoDB Connection Failed ', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
