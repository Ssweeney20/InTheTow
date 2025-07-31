const express = require("express");
const cors = require("cors");
const corsOptions = {
    origin : "http://localhost:5173",
};
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/inthetow')
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(err));

const app = express();

app.use(cors(corsOptions));

app.use("/api/warehouses", require('./routes/warehouses'))

app.listen(8080, () => {
    console.log("Server started on port 8080");
})




