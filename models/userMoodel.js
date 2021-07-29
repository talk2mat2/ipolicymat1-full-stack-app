const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true }, // String is shorthand for {type: String}
  lastName: String,
  salutation: String,
  sex: String,
  mobileNumber: { type: String },
  dateOfBirh: String,
  martiatStatus: String,
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  mobilePhonbe: String,
  isAdmin: { Type: Boolean, default: false },
});

UserSchema.methods.verifyPassword = async function (Password) {
  const match = await bcrypt.compare(Password, this.Password);

  if (match) {
    return true;
  } else {
    return false;
  }
};

module.exports = mongoose.model("Users", UserSchema);
