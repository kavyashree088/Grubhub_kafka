var mongoose = require("mongoose");
var Restaurant = require("./RestaurantSchema");
var Menu = require("./MenuSchema");
var User = require("./UserSchema");
var Schema = mongoose.Schema;
const OrderSchema = new Schema({
  items: [
    {
      itemName: {
        type: String,
        require: true
      },
      price: {
        type: Number,
        require: true
      },
      quantity: {
        type: Number,
        require: true
      }
    }
  ],
  createdAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  user: {
    type: User.UserSchema
  },
  restaurant: {
    type: Restaurant.RestaurantSchema
  }
});
var order = mongoose.model("order", OrderSchema);
module.exports = { order, OrderSchema };
