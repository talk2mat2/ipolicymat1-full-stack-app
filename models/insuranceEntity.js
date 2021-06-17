const mongoose = require("mongoose");

const { Schema } = mongoose;

const insuranceentities = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  tradeName: { type: String },
  type: { type: String },
  classification: { type: String },
  registrationNumber: { type: String },
  yearEstablished: { type: Date },
  website: { type: String },
  telephone: { type: String },
  creditRating: { type: String },
  developerPortal: { type: String },
  productCatalog: { type: String },
  idv: Number,
  logoImg: String,
  addOns: String,
  price: Number,
});

module.exports = mongoose.model("insuranceentities", insuranceentities);
