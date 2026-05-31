const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Falls back to a local instance if process.env.MONGO_URI isn't declared
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urlshortener';
    await mongoose.connect(connStr);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error(`Database Connection Failure: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;