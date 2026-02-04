require('dotenv').config();
const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://inthetow.com",
    "https://www.inthetow.com"
  ]
};
const mongoose = require('mongoose');
const redisClient = require('./config/redis')
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected!");

    await redisClient.connect();
    
    const app = express();

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use("/api/warehouses", require("./routes/warehouses"));
    app.use("/api/reviews", require("./routes/reviews"));
    app.use("/api/user", require("./routes/users"));

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.log("DB connection error:", err);
    process.exit(1);
  }
};

startServer();




