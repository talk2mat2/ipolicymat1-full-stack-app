const mongoose = require("mongoose");

const { Schema } = mongoose;

const HomepageModels = new Schema({
  videoUrl: { type: String,  }, 

});

module.exports = mongoose.model("HomepageModels", HomepageModels);
