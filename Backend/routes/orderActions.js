var express = require("express");
const router = express.Router();
var { menu } = require("../models/MenuSchema");
const mongoose = require("mongoose");
var { cart } = require("../models/CartSchema");
var { user } = require("../models/UserSchema");
var { order } = require("../models/OrderSchema");

var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });
function getConnection() {
  mongoose.connect(
    "mongodb+srv://root:root@clusterkc-cr6mm.mongodb.net/grubhub?retryWrites=true&w=majority",
    { useNewUrlParser: true, poolSize: 10 },
    function(err) {
      if (err) {
        console.log("ERROR! MONGO MONGOOSE");
        throw err;
      } else {
        console.log("Successfully connected to MongoDB");
      }
    }
  );
  return mongoose.connection;
}
router.get("/searchMenu/:menu", (req, res) => {
  try {
    var db = getConnection();
    var regex = new RegExp(["^", req.params.menu, "$"].join(""), "i");
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      console.log("Connection Successful!");
      menu.find(
        { name: regex },
        {
          "restaurant._id": 1,
          "restaurant.name": 1,
          "restaurant.zipcode": 1,
          "restaurant.address": 1,
          "restaurant.phoneNo": 1,
          "restaurant.cuisine": 1
        },
        function(err, result) {
          if (err) {
            res.statusCode = 500;
            console.log("err");
            return res.json({ message: err.message });
          }
          res.statusCode = 200;
          console.log("here");
          return res.send(result);
        }
      );
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.post("/user/addToCart", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    var regex = new RegExp(["^", req.params.menu, "$"].join(""), "i");
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      var item = await menu.findOne({ _id: req.body.itemId }, (err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
      });
      console.log(item);
      var person = await user.findOne(
        { _id: req.body.userId },
        (err, result) => {
          if (err) {
            res.statusCode = 500;
            console.log("err");
            return res.json({ message: err.message });
          }
        }
      );
      console.log(person);

      var cartItem = new cart({
        itemName: req.body.itemName,
        price: req.body.price,
        quantity: req.body.quantity,
        menu: item,
        user: person
      });
      await cartItem.save((err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.get("/cart/:id", (req, res) => {
  console.log("get cart: " + req.params.id);
  try {
    var db = getConnection();
    var regex = new RegExp(["^", req.params.menu, "$"].join(""), "i");
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await cart.find({ "user._id": req.params.id }, (err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.delete("/deletecart/:id", (req, res) => {
  console.log("delete" + req.params.id);
  try {
    var db = getConnection();
    var regex = new RegExp(["^", req.params.menu, "$"].join(""), "i");
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await cart.deleteOne({ _id: req.params.id }, (err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.delete("/deletecartall/:id", (req, res) => {
  console.log("deleteAll " + req.params.id);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await cart.deleteMany({ "user._id": req.params.id }, (err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.post("/placeOrder", (req, res) => {
  console.log(req.body);
  console.log(req.body.items[0].menu);
  console.log(req.body.items[0].user);
  let values = [];
  try {
    var db = getConnection();
    let time = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    req.body.items.map(item => {
      let itemObject = {
        itemName: item.itemName,
        price: parseFloat(item.price),
        quantity: item.quantity
      };
      values.push(itemObject);
    });
    console.log(values);
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      var orderItems = new order({
        items: values,
        createdAt: time,
        status: "New",
        user: req.body.items[0].user,
        restaurant: req.body.items[0].menu.restaurant
      });
      await orderItems.save((err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.get("/getOrders/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await order.find({ "restaurant._id": req.params.id }, (err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.put("/updateOrderStatus", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await order.updateOne(
        { _id: req.body.id },
        { status: req.body.status },
        (err, result) => {
          if (err) {
            res.statusCode = 500;
            console.log("err");
            return res.json({ message: err.message });
          }
          res.statusCode = 200;
          return res.send(result);
        }
      );
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});
router.get("/getUserOrders/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await order.find({ "user._id": req.params.id }, (err, result) => {
        if (err) {
          res.statusCode = 500;
          console.log("err");
          return res.json({ message: err.message });
        }
        res.statusCode = 200;
        return res.send(result);
      });
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});
module.exports = router;
