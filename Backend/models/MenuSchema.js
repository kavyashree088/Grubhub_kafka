var mongoose = require("mongoose");
var Restaurant = require("./RestaurantSchema");
var Schema = mongoose.Schema;
const MenuSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  restaurant: {
    type: Restaurant.RestaurantSchema
  }
});
var menu = mongoose.model("menu", MenuSchema);
module.exports = { menu, MenuSchema };
