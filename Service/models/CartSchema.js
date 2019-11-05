var mongoose = require("mongoose");
var Menu = require("./MenuSchema");
var User = require("./UserSchema");
var Schema = mongoose.Schema;
const CartSchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  menu: {
    type: Menu.MenuSchema
  },
  user: {
    type: User.UserSchema
  }
});
var cart = mongoose.model("cart", CartSchema);
module.exports = { cart, CartSchema };
