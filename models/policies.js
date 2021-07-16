const mongoose = require("mongoose");

const { Schema } = mongoose;

const Policies = new Schema({
  firstName: { type: String }, // String is shorthand for {type: String}
  insurance_type: { type: String },
  lastName: { type: String },
  mobileNumber: { type: String },
  member1: { Type: Object },
  paymentDetails: { type: Object },
  insuranceEntity: { type: Object },
  product_type: String,
  members_nos: String,
  Purchase_for: String,
  email: String,
  productCatalogue: String,
  quoteReferrence: String,
});

module.exports = mongoose.model("Policies", Policies);
