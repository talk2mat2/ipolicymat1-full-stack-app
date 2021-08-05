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
  carQuotePrice: { type: String },
  bikeQuotePrice: { type: String },
  thricycleQuotePrice: { type: String },
  HomeQuotePrice: { type: String },
  lifeQuotePrice: { type: String },
  travelQuotePrice: { type: String },
  phoneQuotePrice: { type: String },
  pcQuotePrice: { type: String },
  gadgetQuotePrice: { type: String },
  laptopQuotePrice: { type: String },
  CameratopQuotePrice: { type: String },
  ipodQuotePrice: { type: String },
  healthQuotePrice: { type: String },
  tabletQuotePrice: { type: String },
  productCatalog: { type: String },
  img: String,
  idv: Number,
  logoImg: String,
  addOns: String,
  price: Number,
});

module.exports = mongoose.model("insuranceentities", insuranceentities);
