const mongoose = require("mongoose");
require("dotenv").config('../.env');
//var url = "mongodb://localhost:27017/martins";
//const url = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0-gussd.mongodb.net/ipmat1?retryWrites=true&w=majority`;
const url = process.env.DATABASE_URL;
const connectDB = async () => {
  await mongoose.connect(
    url,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
    (err, success) => {
      if (err) return console.log(err);
      console.log("connected to mongodb server");
    }
  );
};

// const conn = mongoose.connection;
// gfs = Grid(conn.db, mongoose.mongo);
// gfs.collection("photos");
// exports.gfs = gfs;
module.exports = connectDB;
