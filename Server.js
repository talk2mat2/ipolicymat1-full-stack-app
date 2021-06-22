const express = require("express");
const App = express();
const connectDB = require("./db/connection");
const cors = require("cors");
const UserRoutes = require("./routes/userroutes");
const mongoose = require("mongoose");
const path = require("path");
const { SocketIo } = require("./socket.io");
const UserSchema = require("./models/userMoodel");
process.env.NODE_ENV !== "production" ? require("dotenv").config() : null;
connectDB();
const Port = process.env.PORT || 8080;

App.use(cors());

App.use(express.json({ extended: false }));
App.use(express.static(path.join(__dirname, "./frontend")));
App.set("views", path.join(__dirname, "views"));
// App.set("view engine", "ejs");
App.use("/api/v1", UserRoutes);
App.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend", "index.html"));
});

App.listen(Port, (err, successs) => {
  if (err) throw err;
  else {
    console.log(`server running on port ${Port}`);
  }
});
