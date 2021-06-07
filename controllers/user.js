const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/userMoodel");
const cars = require("../models/cars");

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

exports.Login = async function (req, res) {
  const { Email, Password } = req.body;
  if (!Password || !Email) {
    return res
      .status(404)
      .send({ message: "pls provide a valid password and email" });
  }

  if (!validateEmail(Email)) {
    return res.status(404).json({ message: "pls use a valid email address" });
  }

  UserSchema.findOne({ Email }, async function (err, user) {
    if (err) throw err;
    if (!user) {
      res.status(404).json({
        message:
          "user with this email is not registered with us, concider registering",
      });
    } else if (user) {
      const match = await user.verifyPassword(Password);
      if (!match) {
        return res
          .status(401)
          .json({ message: "oopss! , the entered password is not correct." });
      } else {
        user.Password = "";
        return res.json({
          userdata: user,
          token: jwt.sign({ user: user }, process.env.JWTKEY, {
            expiresIn: "17520hr",
          }),
        });
      }
    }
  });
};

exports.Register = async (req, res) => {
  const { firstName, lastName, Email, Password, Password2, Gender } = req.body;

  if (!validateEmail(Email)) {
    return res
      .status(404)
      .json({ message: "pls use a valid email address to register" });
  }
  if (Password2 != Password) {
    return res.status(404).json({ message: "both password dont match" });
  }
  if (!Password2 || !Password || !lastName || !firstName || !Email || !Gender) {
    return res.status(404).json({
      message: "oops! you didnt fill all values required,kindly try again",
    });
  }
  await UserSchema.findOne({ Email: Email }).then((user) => {
    if (user) {
      return res.status(401).send({
        message: `a user with email ${Email}is already registred, try to login`,
      });
    }
  });
  try {
    const RegisterdDate = new Date();

    const Passwordhash = bcrypt.hashSync(Password, 10);
    const newUser = new UserSchema({
      firstName,
      lastName,
      Email,
      Password: Passwordhash,
      RegisterdDate,
      Gender,
    });
    await newUser.save();
    return res.status(200).send({ message: "account registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(501).send({
      message: "error occured pls try again or contact admin",
      err: err,
    });
  }
};

exports.ListAllCars = async (req, res) => {
  let total = await cars.countDocuments({});
  const limit = 15;
  await cars
    .find({})
    .limit(limit)
    .then((result) => {
      return res.status(200).json({
        status: "success",
        userData: result,
        total: total,
        limit: limit,
      });
    })
    .catch((err) => {
      return res
        .status(501)
        .json({ status: "fail", message: "an error occured" });
    });
};

exports.FindCarModels = async (req, res) => {
  const { CarBrands } = req.query;

  if (!CarBrands) {
    return res
      .status(501)
      .json({ status: "fail", message: "no car brand name supplied" });
  }
  const captialize = (words) =>
    words
      .split(" ")
      .map((w) => w.substring(0, 1).toUpperCase() + w.substring(1))
      .join(" ");
  const UppercaseName = captialize(CarBrands);
  // const Params = { name: UppercaseName };
  const Params = { name: { $regex: UppercaseName, $options: "i" } };
  let total = await cars.countDocuments(Params);
  await cars
    .findOne(Params)
    .then((result) => {
      return res.status(200).json({
        status: "success",
        userData: result,
        total: total,
      });
    })
    .catch((err) => {
      return res
        .status(501)
        .json({ status: "fail", message: "an error occured" });
    });
};

exports.FindCarModelsBySearch = async (req, res) => {
  const { search } = req.query;
  const limit = 6;
  if (!search) {
    return res
      .status(501)
      .json({ status: "fail", message: "no search Query provided" });
  }
  const Params = { name: { $regex: search, $options: "i" } };
  let total = await cars.countDocuments(Params);
  await cars
    .find(Params)
    .limit(limit)
    .then((result) => {
      return res.status(200).json({
        status: "success",
        userData: result,
        total: total,
        limit: limit,
      });
    })
    .catch((err) => {
      return res
        .status(501)
        .json({ status: "fail", message: "an error occured" });
    });
};
