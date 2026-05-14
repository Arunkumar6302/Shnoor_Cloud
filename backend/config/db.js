const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to mongo: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
  } catch (err) {
    console.error("Failed to connect to db", err);
    process.exit(1);
  }
};

module.exports = connectDB;
