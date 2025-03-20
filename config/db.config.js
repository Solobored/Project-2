const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Update the database name to E-commerceAPI
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'E-commerceAPI'
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;