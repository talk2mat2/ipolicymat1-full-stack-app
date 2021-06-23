const { v4: uuidv4 } = require("uuid");

const { LoginbyJWT } = require("../middlewares/auth");
const express = require("express");
const multer = require("multer");
const path = require("path");
const Router = express.Router();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEYS_CLOUD,
  api_secret: process.env.API_SECRET_CLOUD,
});
const fs = require("fs");

const UserSchema = require("../models/userMoodel");
const {
  Login,
  Register,
  ListAllCars,
  FindCarModels,
  fetchinsuranceEntity,
  FindCarModelsBySearch,
  PurchaseInsurance,
  ListAllBikes,
  FindBikeModels,
  FindBikeModelsBySearch,
} = require("../controllers/user");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "./upload"
      //  path.join(__dirname, "../public/image")
    );
  },
  filename: function (req, file, cb) {
    cb(
      null,

      file.fieldname + "-" + `${uuidv4()}` + path.extname(file.originalname)
    );
  },
});

const fileFilter = async (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  // dest: "public/image/uploaded",
  storage: storage,

  fileFilter: fileFilter,
});

Router.post("/login", Login);

Router.post("/Register", Register);
Router.get("/listAllCars", ListAllCars);
Router.get("/ListAllBikes", ListAllBikes);
Router.get("/FindCarModels", FindCarModels);
Router.get("/FindBikeModels", FindBikeModels);
Router.get("/fetchinsuranceEntity", fetchinsuranceEntity);
Router.get("/FindCarModelsBySearch", FindCarModelsBySearch);
Router.get("/FindBikeModelsBySearch", FindBikeModelsBySearch);
Router.post("/PurchaseInsurance", PurchaseInsurance);

module.exports = Router;
