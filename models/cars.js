const mongoose = require("mongoose");

const { Schema } = mongoose;

const cars = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  models: [{ name: String, series: String }],
});

module.exports = mongoose.model("cars", cars);
