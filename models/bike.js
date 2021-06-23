const mongoose = require("mongoose");

const { Schema } = mongoose;

const bikebrands = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  id: Number,
});
const bikemodels = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  id: Number,
  brand_id: Number,
});

exports.bikebrands = mongoose.model("bikebrands", bikebrands);
exports.bikemodels = mongoose.model("bikemodels", bikemodels);
