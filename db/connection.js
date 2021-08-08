const mongoose = require("mongoose");
process.env.NODE_ENV !== "production" ? require("dotenv").config() : null;
var url = "mongodb://localhost:27017/ip1";
//const url = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0-gussd.mongodb.net/ipmat1?retryWrites=true&w=majority`;

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
