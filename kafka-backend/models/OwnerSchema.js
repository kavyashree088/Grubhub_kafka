var mongoose = require("mongoose");
var Restaurant = require("./RestaurantSchema");
var Schema = mongoose.Schema;
const OwnerSchema = new Schema({
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
  restaurant: {
    type: Restaurant.RestaurantSchema
  }
});
var owner = mongoose.model("owners", OwnerSchema);
module.exports = { owner, OwnerSchema };
