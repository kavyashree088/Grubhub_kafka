var express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
var { owner } = require("../models/OwnerSchema");
var { restaurant } = require("../models/RestaurantSchema");
var { menu } = require("../models/MenuSchema");
const mongoose = require("mongoose");

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

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
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

  var newRestaurant = new restaurant({
    name: restaurantName,
    address: "",
    phoneNo: "",
    cuisine: "",
    zipcode: zipCode,
    image: ""
  });
  var newOwner = new owner({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword,
    restaurant: newRestaurant
  });
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      console.log("Connection Successful!");
      var result = await newOwner.save(function(err, owner) {
        if (err) return console.error(err);
        console.log(owner.firstName + " saved to bookstore collection.");
      });
      res.statusCode = 200;
      console.log("here");
      return res.send(result);
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.post("/login", async function(req, res) {
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      console.log(req.body.email);
      owner
        .find({
          email: req.body.email // search query
        })
        .then(doc => {
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            if (bcrypt.compareSync(req.body.password, doc[0].password)) {
              console.log("true");
              var token = {
                signinSuccess: "success",
                email: doc[0].email
              };
              var signed_token = jwt.sign(token, "cmpe273", {
                expiresIn: 86400 // in seconds
              });
              res.statusCode = 200;
              res.json({
                message: "authentication done ",
                token: signed_token,
                userType: "owner",
                user: doc
              });
            } else {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end();
            }
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["Invalid Login"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: ["Invalid Login"] });
        });
    });
  } catch (error) {
    console.log("error");
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

router.get("/details/:email", (req, res) => {
  console.log(req.params);
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      owner
        .find({
          email: req.params.email // search query
        })
        .then(doc => {
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            res.statusCode = 200;
            res.end(JSON.stringify(doc));
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["Invalid Login"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: ["Invalid Login"] });
        });
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
});

router.get("/restaurant/:email", (req, res) => {
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      owner
        .find({
          email: req.params.email // search query
        })
        .then(doc => {
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            res.statusCode = 200;
            res.end(JSON.stringify(doc[0].restaurant));
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["Invalid Login"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: ["Invalid Login"] });
        });
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

router.get("/restaurantById/:id", (req, res) => {
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      owner
        .find(
          {
            "restaurant._id": req.params.id // search query
          },
          {
            "restaurant._id": 1,
            "restaurant.name": 1,
            "restaurant.zipcode": 1,
            "restaurant.address": 1,
            "restaurant.phoneNo": 1,
            "restaurant.cuisine": 1,
            "restaurant.image": 1
          }
        )
        .then(doc => {
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            res.statusCode = 200;
            res.end(JSON.stringify(doc[0].restaurant));
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["Invalid Login"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: ["Invalid Login"] });
        });
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ message: error.message });
  }
});

router.get("/menu/:id", (req, res) => {
  try {
    console.log("menu");
    var db = getConnection();
    var ObjectId = require("mongoose").Types.ObjectId;
    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      menu
        .find({
          "restaurant._id": req.params.id
        })
        .then(doc => {
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            res.statusCode = 200;
            res.end(JSON.stringify(doc));
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["no menu"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: err.message });
        });
    });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ errors: ["Invalid Login"] });
  }
});

router.post("/createmenu", upload.single("image"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  let filePath = "";
  if (!file) {
    filePath = "";
  } else filePath = file.filename;
  console.log(filePath);
  try {
    var db = getConnection();
    var restaurant = null;
    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      owner
        .find({
          email: req.body.email
        })
        .then(doc => {
          console.log("here");
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            restaurant = doc[0].restaurant;
            var newMenu = new menu({
              name: req.body.name,
              description: req.body.desc,
              section: req.body.section,
              price: req.body.price,
              image: filePath,
              restaurant: restaurant
            });
            var result = newMenu.save(function(err, menu) {
              if (err) return console.error(err);
              console.log(menu.name + " saved to bookstore collection.");
            });
            res.statusCode = 200;
            console.log("here");
            return res.send(result);
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["no restaurant"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: err.message });
        });
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/updatemenu", upload.single("image"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  let filePath = "";
  if (!file) {
    filePath = "";
  } else filePath = file.filename;
  console.log(filePath);
  try {
    var db = getConnection();
    var ObjectId = require("mongoose").Types.ObjectId;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await menu.updateOne(
        { _id: req.body.id },
        {
          name: req.body.itemName,
          description: req.body.desc,
          price: req.body.price,
          section: req.body.section,
          image: filePath
        },
        function(err, menu) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(menu);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.delete("/deletemenu/:id", (req, res) => {
  try {
    var db = getConnection();
    var ObjectId = require("mongoose").Types.ObjectId;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await menu.remove({ _id: req.params.id }, function(err, menu) {
        if (err) {
          res.statusCode = 500;
          return res.json({ errors: err.message });
        }
        res.statusCode = 200;
        return res.send();
      });
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/name", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      owner.updateOne(
        { email: req.body.email },
        { firstName: req.body.firstName, lastName: req.body.lastName },
        function(err, owner) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(owner);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/email", (req, res) => {
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      owner.updateOne(
        { email: req.body.email },
        { email: req.body.newEmail },
        function(err, owner) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(owner);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/password", (req, res) => {
  console.log(req.body);
  let hashPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
  console.log(hashPassword);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      owner.updateOne(
        { email: req.body.email },
        { password: hashPassword },
        function(err, owner) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(owner);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/restaurantdetails", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", async function() {
      console.log("Connection Successful!");
      await owner.updateOne(
        {
          "restaurant._id": req.body.id
        },
        {
          "restaurant.name": req.body.name,
          "restaurant.address": req.body.address,
          "restaurant.phoneNo": req.body.phoneNo,
          "restaurant.zipcode": req.body.zipcode,
          "restaurant.cuisine": req.body.cuisine
        },
        function(err, owner) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          menu.updateMany(
            {
              "restaurant._id": req.body.id
            },
            {
              "restaurant.name": req.body.name,
              "restaurant.address": req.body.address,
              "restaurant.phoneNo": req.body.phoneNo,
              "restaurant.zipcode": req.body.zipcode,
              "restaurant.cuisine": req.body.cuisine
            },
            function(err, result) {
              if (err) {
                console.log(err);
              }
              console.log(result);
            }
          );
          res.statusCode = 200;
          return res.send(owner);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
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
    try {
      var db = getConnection();
      db.on("error", console.error.bind(console, "connection error:"));

      db.once("open", async function() {
        console.log("Connection Successful!");
        await owner.updateOne(
          {
            "restaurant._id": req.body.id
          },
          {
            "restaurant.image": filePath
          },
          function(err, owner) {
            if (err) {
              res.statusCode = 500;
              return res.json({ errors: err.message });
            }
            res.statusCode = 200;
            return res.send(owner);
          }
        );
      });
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      return res.json({ errors: error.message });
    }
  }
);

router.delete("/deleteSection/:name/:id", (req, res) => {
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      await menu.remove(
        { "restaurant._id": req.params.id, section: req.params.name },
        function(err, menu) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send();
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

module.exports = router;
