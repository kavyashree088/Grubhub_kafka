var mongoose = require("mongoose");
var autoIncrement = require("mongodb-autoincrement");
var Schema = mongoose.Schema;
const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  cuisine: {
    type: String
  },
  phoneNo: {
    type: Number
  },
  zipcode: {
    type: String
  },
  image: {
    type: String
  }
});
var restaurant = mongoose.model("restaurant", RestaurantSchema);
module.exports = { restaurant, RestaurantSchema };
