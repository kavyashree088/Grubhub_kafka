var mongoose = require("mongoose");
var autoIncrement = require("mongodb-autoincrement");
var Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phoneNo: {
    type: String
  },
  profilePic: {
    type: String
  }
});
var user = mongoose.model("users", UserSchema);
module.exports = { user, UserSchema };
