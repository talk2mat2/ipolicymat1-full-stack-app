const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/userMoodel");
const insuranceentity = require("../models/insuranceEntity");
const Claims = require("../models/Claims");
const cars = require("../models/cars");
const Policies = require("../models/policies");
const { bikebrands, bikemodels } = require("../models/bike");
const axios = require("axios");
const path = require("path");
require("dotenv").config('../.env');
const fs = require("fs");
// var child_process = require("child_process");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

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
    return res.status(404).json({ message: "Pls use a valid email address" });
  }

  UserSchema.findOne({ Email }, async function (err, user) {
    if (err) throw err;
    if (!user) {
      res.status(404).json({
        message: " A user with this account does not exist",
      });
    } else if (user) {
      const match = await user.verifyPassword(Password);
      if (!match) {
        return res
          .status(401)
          .json({ message: "The entered password is not correct." });
      } else {
        user.Password = "";
        return res.json({
          status: "success",
          userData: {
            token: jwt.sign({ user: user }, process.env.JWTKEY, {
              expiresIn: "17520hr",
            }),
            user,
          },
        });
      }
    }
  });
};

exports.Register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    password2,
    Gender,
    mobileNumber,
  } = req.body;
  // console.log(req.body);
  const Email = email;
  const Password = password;
  const Password2 = password2;
  if (!validateEmail(Email)) {
    return res
      .status(501)
      .json({ message: "pls use a valid email address to register" });
  }
  if (Password2 != Password) {
    return res.status(501).json({ message: "both password dont match" });
  }
  console.log(firstName, lastName, email, Password, Password2, Gender);
  if (!Password2 || !Password || !lastName || !firstName || !Email) {
    return res.status(501).json({
      message: "You didnt fill all values required,kindly try again",
    });
  }
  await UserSchema.findOne({ Email: Email }).then((user) => {
    if (user) {
      return res.status(501).send({
        message: `a user with email ${Email}is already registred, proceed to login`,
      });
    }
  });
  try {
    const RegisterdDate = new Date();

    const Passwordhash = bcrypt.hashSync(Password, 10);
    const newUser = new UserSchema({
      firstName,
      mobileNumber,
      lastName,
      Email,
      Password: Passwordhash,
      RegisterdDate,
    });
    await newUser.save();

    this.Login({ body: { Email, Password } }, res);
    // return res.status(200).send({ message: "account registered successfully" });
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
exports.ListAllBikes = async (req, res) => {
  let total = await bikebrands.countDocuments({});
  const limit = 15;
  await bikebrands
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
exports.FindBikeModels = async (req, res) => {
  const { BikeBrands_id } = req.query;
  // console.log(BikeBrands_id);
  if (!BikeBrands_id) {
    console.log("no bike id supplied");
    return res
      .status(501)
      .json({ status: "fail", message: "no bike brand id supplied" });
  }
  const BikeBrands_id_integer = parseFloat(BikeBrands_id);

  // const Params = { name: UppercaseName };
  const Params = { brand_id: BikeBrands_id_integer };
  let total = await bikemodels.countDocuments(Params);
  await bikemodels
    .find(Params)
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

exports.FindBikeModelsBySearch = async (req, res) => {
  const { search } = req.query;

  const limit = 6;
  if (!search) {
    return res
      .status(501)
      .json({ status: "fail", message: "no search Query provided" });
  }
  const Params = { name: { $regex: search, $options: "i" } };
  let total = await bikebrands.countDocuments(Params);
  await bikebrands
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

exports.fetchinsuranceEntity = async (req, res) => {
  let total = await insuranceentity.estimatedDocumentCount({});
  const { category } = req.query;
  // console.log(category);
  const query =
    category === "car"
      ? { carQuotePrice: { $exists: true, $ne: "" } }
      : category === "bike"
      ? { bikeQuotePrice: { $exists: true, $ne: "" } }
      : category === "thricycle"
      ? { thricycleQuotePrice: { $exists: true, $ne: "" } }
      : category === "home"
      ? { HomeQuotePrice: { $exists: true, $ne: "" } }
      : category === "life"
      ? { lifeQuotePrice: { $exists: true, $ne: "" } }
      : category === "travel"
      ? { travelQuotePrice: { $exists: true, $ne: "" } }
      : category === "health"
      ? { healthQuotePrice: { $exists: true, $ne: "" } }
      : category === "gadget"
      ? { gadgetQuotePrice: { $exists: true, $ne: "" } }
      : category === "all"
      ? { }
      : { _id:34};
  const limit = 15;
  await insuranceentity
    .find(query)
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

exports.PurchaseInsurance = async (req, res) => {
  console.log(req.body);
  const { paymentDetails } = req.body;

  //verify payment from paystack before we give the purchase value to the client

  await axios
    .get(
      `https://api.paystack.co/transaction/verify/${paymentDetails.reference}`,
      {
        headers: {
          Authorization: `Bearer sk_test_82fde3c8244fda92873ad6c1b12287389badd38f`,
        },
      }
    )
    .then(async (response) => {
      // console.log(response.data);
      if (response.data.data.status === "success") {
        //means the guy paid truly// then we process the guys purchase item
        // console.log(req.body);
        const NewPolicy = new Policies({ ...req.body });
        await NewPolicy.save();

        return res.status(200).json({
          status: "success",
          message: "Your Purchase was successfull",
        });
      } else {
        return res.status(501).json({
          status: "fail",
          message: "Unable to verify payment status",
        });
      }
    })
    .catch((err) => {
      if (err.message) {
        console.log(err.message);
      }
      console.log(err);
      return res.status(501).json({
        status: "fail",
        message: "An error occured",
      });
    });
};

//find policies for user by email

exports.ListMypolicy = async (req, res) => {
  //req.body.id= current usser
  const limit = 10;
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({
      status: "fail",
      message: "not sign in or provided jwt",
    });
  }
  await UserSchema.findOne({ _id: id })
    .then(async (user) => {
      // console.log(user);
      const Query = { email: user.Email };
      let total = await Policies.estimatedDocumentCount(Query);
      await Policies.find(Query)
        .limit(limit)
        .then((policies) => {
          // console.log(policies);
          return res.status(200).json({
            status: "success",
            userData: policies,
            total: total,
            limit: limit,
          });
        })
        .catch((err) => {
          return res.status(404).json({
            status: "fail",
            message: "empty",
          });
        });
    })
    .catch((err) => {
      return res.status(404).json({
        status: "fail",
        message: "empty",
      });
    });
};
exports.SyncronizeUserData = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({
      status: "fail",
      message: "not sign in or provided jwt",
    });
  }
  await UserSchema.findOne({ _id: id }).then(async (user) => {
    user.Password = "";
    return res.json({
      status: "success",
      userData: {
        user,
      },
    });
  });
};
exports.updateProfile = async (req, res) => {
  const { firstName, lastName, maritalStatus, mobileNumber, dateOfBirth } =
    req.body;
  const params = {
    firstName,
    lastName,
    maritalStatus,
    mobileNumber,
    dateOfBirth,
  };
  // console.log(req.body);
  //we dont wan to update undefined or null to a users data to our database
  Object.keys(params).map((xxx) =>
    params[xxx] === null || typeof params[xxx] === "undefined"
      ? delete params[xxx]
      : null
  );
  // console.log(params);
  await UserSchema.findOneAndUpdate({ _id: req.body.id }, params, {
    returnOriginal: false,
    useFindAndModify: false,
  }).then(async () => {
    await this.SyncronizeUserData(req, res);
  });
};

exports.countUsersAndPolicies = async (req, res) => {
  const totalPolicies = await Policies.estimatedDocumentCount({});
  const TotalUsers = await UserSchema.estimatedDocumentCount({});
  const totalInsuranceEntitites = await insuranceentity.estimatedDocumentCount(
    {}
  );

  try {
    return res.status(200).json({
      status: "success",
      userData: { totalPolicies, TotalUsers, totalInsuranceEntitites },
    });
  } catch (err) {
    return res.status(200).json({
      status: "fail",
      message: "an error occured",
    });
  }
};

exports.addInsurer = async (req, res) => {
  console.log(req.file);
  const { formResponse } = req.body;

  const {
    name,
    tradeName,
    classification,
    registrationYear,
    yearEstablished,
    website,
    telephone,
    creditRating,
    developerPoral,
    carQuotePrice,
    bikeQuotePrice,
    thricycleQuotePrice,
    HomeQuotePrice,
    lifeQuotePrice,
    travelQuotePrice,
    phoneQuotePrice,
    pcQuotePrice,
    laptopQuotePrice,
    CameratopQuotePrice,
    gadgetQuotePrice,
    ipodQuotePrice,
    tabletQuotePrice,
    healthQuotePrice,
    registrationNumber,
  } = JSON.parse(formResponse);

  const params = {
    name,
    tradeName,
    classification,
    registrationYear,
    gadgetQuotePrice,
    yearEstablished,
    website,
    telephone,
    creditRating,
    developerPoral,
    carQuotePrice,
    bikeQuotePrice,
    thricycleQuotePrice,
    HomeQuotePrice,
    lifeQuotePrice,
    travelQuotePrice,
    phoneQuotePrice,
    pcQuotePrice,
    laptopQuotePrice,
    CameratopQuotePrice,
    ipodQuotePrice,
    tabletQuotePrice,
    healthQuotePrice,
    registrationNumber,
  };
  if (!name) {
    return res.status(404).json({
      status: "fail",
      message: "Insurer name is required",
    });
  }

  Object.keys(params).map((xxx) =>
    params[xxx] === null || typeof params[xxx] === "undefined"
      ? delete params[xxx]
      : null
  );
  console.log(req.headers.host);
  // const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  // const url =
  //   req.protocol +
  //   "://" +
  //   req.get("host") +
  //   "/api/v1/upload/" +
  //   req.file.filename;
  const url =
   process.env.WEB_URL +
    "/api/v1/upload/" +
    req.file.filename;
  console.log(url);
  const NewInsurer = new insuranceentity({
    ...params,
    logoImg: url,
  });

  await NewInsurer.save();
  return res.status(202).json({
    status: "success",
    message: "Information Saved Successfully",
  });
};
exports.DeleteInsuranceEntity = async (req, res) => {
  const { insureId } = req.body;
  console.log(insureId);
  if (!insureId) {
    return res.status(501).send({
      status: "fail",
      message: "pls provide a valid password and email",
    });
  }

  await insuranceentity
    .findByIdAndDelete(insureId)
    .then((xxx) => {
      return res.status(200).send({
        status: "success",
        message: "the requested operation was successful",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(501).send({
        status: "fail",
        message: "There was an error perfoming the requested operation",
      });
    });
};

//serve media image from mongodb grfs database
exports.MediaImage = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.send("not found");
  }
};

exports.ListAllpolicy = async (req, res) => {
  //req.body.id= current usser
  var pageNo = req.query.pageNo || 0;

  const limit = 10;
  var skip = pageNo * limit 
      // console.log(user);
      const Query = {  };
      let total = await Policies.estimatedDocumentCount(Query);
      await Policies.find(Query).skip(skip)
        .limit(limit)
        .then((policies) => {
          // console.log(policies);
          return res.status(200).json({
            status: "success",
            userData: policies,
            total: total,
            limit: limit,
          });
        })
        .catch((err) => {
          return res.status(404).json({
            status: "fail",
            message: "empty",
          });
        });
};
exports.ListAllClaims = async (req, res) => {
  //req.body.id= current usser
  var pageNo = req.query.pageNo || 0;

  const limit = 10;
  var skip = pageNo * limit 
      // console.log(user);
      const Query = {  };
      let total = await Claims.estimatedDocumentCount(Query);
      await Claims.find(Query).skip(skip)
        .limit(limit)
        .then((claims) => {
          // console.log(policies);
          return res.status(200).json({
            status: "success",
            userData: claims,
            total: total,
            limit: limit,
          });
        })
        .catch((err) => {
          return res.status(404).json({
            status: "fail",
            message: "empty",
          });
        });
};

exports.SubmitClaimRequest= async (req,res)=>{
  console.log(req.body)
const {firstName,mobileNumber,policyNumber} = req.body

try{
if (!firstName,!mobileNumber,!policyNumber) {
  return res.status(501).send({
    status: "fail",
    message: " The required fields not provided",
  });
}

else{
  const newClaims = new Claims({...req.body});
  await newClaims.save()
  return res.status(200).json({
    status: "success",
    message:"Claim Request Successfully Made"
  });
}
}
catch(err){
  console.log(err)
  return res.status(501).send({
    status: "fail",
    message: "The Requested Operation was not successfull, kindly try again later",
  });
}
}