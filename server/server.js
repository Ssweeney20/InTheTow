require('dotenv').config();
const express = require("express");
const cors = require("cors");
const corsOptions = {
    origin : "http://localhost:5173",
};
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(err));

const app = express();

app.use(cors(corsOptions))

app.use(express.json())

app.use('/api/warehouses', require('./routes/warehouses'))

app.use('/api/reviews', require('./routes/reviews'))

app.listen(8080, () => {
    console.log("Server started on port 8080");
})




