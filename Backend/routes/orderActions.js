var express = require("express");
const router = express.Router();
var { order } = require("../models/OrderSchema");
var kafka = require("../kafka/client");

router.get("/searchMenu/:menu", (req, res) => {
  let body = {
    menu: req.params.menu
  };
  kafka.make_request("orderActions", { path: "searchMenu", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});

router.post("/user/addToCart", (req, res) => {
  console.log(req.body);
  let body = {
    itemId: req.body.itemId,
    itemName: req.body.itemName,
    price: req.body.price,
    quantity: req.body.quantity
  };
  kafka.make_request("orderActions", { path: "addToCart", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});

router.delete("/deletecartall/:id", (req, res) => {
  console.log("deleteAll " + req.params.id);
  let body = {
    id: req.params.id
  };
  kafka.make_request("orderActions", { path: "deleteCartAll", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});

router.post("/placeOrder", (req, res) => {
  let values = [];
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
  let body = {
    items: values,
    createdAt: time,
    status: "New",
    user: req.body.items[0].user,
    restaurant: req.body.items[0].menu.restaurant
  }
  kafka.make_request("orderActions", { path: "placeOrder", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });

});

router.get("/getOrders/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  let body = {
    id: req.params.id
  }
  kafka.make_request("orderActions", { path: "getOrders", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});

router.put("/updateOrderStatus", (req, res) => {
  console.log(req.body);
  let body = {
    id: req.body.id,
    status: req.body.status
  }
  kafka.make_request("orderActions", { path: "updateOrderStatus", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});
router.get("/getUserOrders/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  let body = {
    id: req.params.id
  }
  kafka.make_request("orderActions", { path: "getUserOrders", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.send(result);
    }
  });
});
module.exports = router;
