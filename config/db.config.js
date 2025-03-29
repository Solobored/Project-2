const mongoose = require("mongoose");

const isConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  try {
    if (isConnected()) {
      console.log('Using existing database connection');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;