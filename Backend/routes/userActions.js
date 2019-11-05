var express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });
const multer = require("multer");

router.get("/", (req, res) => {
  let body = {
    get: "all"
  };
  kafka.make_request("userActions", { path: "get", body }, function(
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
router.post("/createUser", async (req, res) => {
  try {
    console.log("post");
    console.log(req.body);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let email = req.body.email;
    let hashPassword = bcrypt.hashSync(password, saltRounds);
    console.log(hashPassword.length);
    var body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      phoneNo: "",
      address: "",
      profilePic: ""
    };
    kafka.make_request("userActions", { path: "createUser", body }, function(
      err,
      result
    ) {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});
router.post("/loginUser", async function(req, res) {
  try {
    let body = {
      email: req.body.email,
      password: req.body.password
    };
    kafka.make_request("userActions", { path: "loginUser", body }, function(
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
  } catch (error) {
    console.log("error");
    res.json({ message: error.message });
  }
});

router.get("/userdetails/:email", (req, res) => {
  console.log("User Details " + req.params.email);
  let body = {
    email: req.params.email
  };
  kafka.make_request("userActions", { path: "userdetails", body }, function(
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
  kafka.make_request("userActions", { path: "updateName", body }, function(
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
  kafka.make_request("userActions", { path: "updateEmail", body }, function(
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
  kafka.make_request("userActions", { path: "updatePassword", body }, function(
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

router.put("/update/address", (req, res) => {
  console.log(req.body);
  let body = {
    email: req.body.email,
    address: req.body.address
  };
  kafka.make_request("userActions", { path: "updateAddress", body }, function(
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

router.put("/update/phoneNo", (req, res) => {
  console.log(req.body);
  let body = {
    email: req.body.email,
    phoneNo: req.body.phoneNo
  };
  kafka.make_request("userActions", { path: "updatePhoneNo", body }, function(
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
router.post("/update/profilePhoto", upload.single("imageFile"), (req, res) => {
  console.log(req.file);
  const file = req.file;
  console.log(file.originalname);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return res.json({ errors: ["Cannot upload ProfileImage"] });
  }
  let filePath = file.filename;
  console.log(filePath);
  console.log(req.body);
  let body = {
    email: req.body.email,
    profilePic: filePath
  };
  kafka.make_request(
    "userActions",
    { path: "updateProfilePhoto", body },
    function(err, result) {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = router;
