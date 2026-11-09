const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connexion Error : ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;