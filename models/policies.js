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
  dob_day: String,
  dob_month: String,
  dob_year: String,
  Provide_No_Claim: String,
  email: String,
  productCatalogue: String,
  quoteReferrence: String,
  coverType: { Type: String },
  otherData: Object,
  quoteReference: String,
});

module.exports = mongoose.model("Policies", Policies);
