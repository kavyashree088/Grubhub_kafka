var express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
var { owner } = require("../models/OwnerSchema");
var { restaurant } = require("../models/RestaurantSchema");
var { menu } = require("../models/MenuSchema");
const mongoose = require("mongoose");
var kafka = require("../kafka/client");

var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let newFileName = Date.now() + file.originalname;
    cb(null, newFileName);
  }
});
var upload = multer({ storage: storage });
router.post("/createOwner", (req, res) => {
  console.log("post");
  console.log(req.body);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let password = req.body.password;
  let email = req.body.email;
  let hashPassword = bcrypt.hashSync(password, saltRounds);
  let restaurantName = req.body.restaurantName;
  let zipCode = req.body.zipCode;

  var newRestaurant = {
    name: restaurantName,
    address: "",
    phoneNo: "",
    cuisine: "",
    zipcode: zipCode,
    image: ""
  };
  var body = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword,
    restaurant: newRestaurant
  };

  kafka.make_request("ownerActions", { path: "createOwner", body }, function (
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

router.post("/login", async function (req, res) {
  let body = {
    email: req.body.email,
    password: req.body.password
  };
  kafka.make_request("ownerActions", { path: "loginOwner", body }, function (
    err,
    result
  ) {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.statusCode = result.status;
      res.send(result);
    }
  });
});

router.get("/details/:email", (req, res) => {
  console.log("User Details " + req.params.email);
  let body = {
    email: req.params.email
  };
  kafka.make_request("ownerActions", { path: "ownerdetails", body }, function (
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

router.get("/restaurant/:email", (req, res) => {
  console.log("User Details " + req.params.email);
  let body = {
    email: req.params.email
  };
  kafka.make_request(
    "ownerActions",
    { path: "restaurantDetails", body },
    function (err, result) {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.send(result);
      }
    }
  );
});

router.get("/restaurantById/:id", (req, res) => {
  let body = {
    id: req.params.id
  };
  kafka.make_request(
    "ownerActions",
    { path: "restaurantDetailsById", body },
    function (err, result) {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.send(result);
      }
    }
  );
});

router.get("/menu/:id", (req, res) => {
  let body = {
    id: req.params.id
  };
  kafka.make_request("ownerActions", { path: "getMenu", body }, function (
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

router.post("/createmenu", upload.single("image"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  let filePath = "";
  if (!file) {
    filePath = "";
  } else filePath = file.filename;
  console.log(filePath);
  let body = {
    name: req.body.name,
    description: req.body.desc,
    section: req.body.section,
    price: req.body.price,
    image: filePath,
    email: req.body.email
  };
  kafka.make_request("ownerActions", { path: "createMenu", body }, function (
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

router.put("/updatemenu", upload.single("image"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  let filePath = "";
  if (!file) {
    filePath = "";
  } else filePath = file.filename;
  console.log(filePath);
  let body = {
    id: req.body.id,
    name: req.body.itemName,
    description: req.body.desc,
    price: req.body.price,
    section: req.body.section,
    image: filePath
  };
  kafka.make_request("ownerActions", { path: "updateMenu", body }, function (
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

router.delete("/deletemenu/:id", (req, res) => {
  let body = {
    id: req.params.id
  };
  kafka.make_request("ownerActions", { path: "deleteMenu", body }, function (
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

router.put("/update/name", (req, res) => {
  console.log(req.body);
  let body = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  kafka.make_request("ownerActions", { path: "updateName", body }, function (
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

router.put("/update/email", (req, res) => {
  let body = {
    email: req.body.email,
    newEmail: req.body.newEmail
  };
  kafka.make_request("ownerActions", { path: "updateEmail", body }, function (
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

router.put("/update/password", (req, res) => {
  console.log(req.body);
  let hashPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
  console.log(hashPassword);
  let body = {
    email: req.body.email,
    hashPassword: hashPassword
  };
  kafka.make_request("ownerActions", { path: "updatePassword", body }, function (
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

router.put("/update/restaurantdetails", (req, res) => {
  console.log(req.body);
  let body = {
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    phoneNo: req.body.phoneNo,
    zipcode: req.body.zipcode,
    cuisine: req.body.cuisine
  };
  kafka.make_request(
    "ownerActions",
    { path: "updateRestaurantDetails", body },
    function (err, result) {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.send(result);
      }
    }
  );
});

router.post(
  "/update/restaurant/image",
  upload.single("imageFile"),
  (req, res) => {
    const file = req.file;

    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return res.json({ errors: ["Cannot upload ProfileImage"] });
    }
    let filePath = file.filename;
    console.log(filePath);
    let body = {
      id: req.body.id,
      image: filePath
    };
    kafka.make_request(
      "ownerActions",
      { path: "updateRestaurantImage", body },
      function (err, result) {
        if (err) {
          res.json({ message: err.message });
        } else {
          res.send(result);
        }
      }
    );
  }
);

router.delete("/deleteSection/:name/:id", (req, res) => {
  let body = {
    id: req.params.id,
    section: req.params.name
  };
  kafka.make_request("ownerActions", { path: "deleteSection", body }, function (
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
