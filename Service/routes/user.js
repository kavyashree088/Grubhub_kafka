var express = require("express");
const mysql = require("mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");

function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kavya10ka",
    database: "grubhub"
  });
}

router.get("/users", function(req, res) {
  console.log("Fetch users");
  const connection = getConnection();
  connection.query("SELECT * FROM users", (err, rows, fields) => {
    if (err) throw err;
    console.log("Success");
    res.statusCode = 200;
    return res.json(rows);
  });
  connection.end();
});

router.post("/createUser", function(req, res) {
  console.log("post");
  console.log(req.body);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let password = req.body.password;
  let email = req.body.email;
  let hashPassword = bcrypt.hashSync(password, saltRounds);
  console.log(hashPassword.length);
  const queryToInsert =
    "INSERT INTO users ( password, firstName, lastName, email) values(?,?,?,?) ";
  connection = getConnection();
  connection.query(
    queryToInsert,
    [hashPassword, firstName, lastName, email],
    (err, results, fields) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot insert the user details"] });
      }
      res.statusCode = 200;
      return res.json();
    }
  );
  connection.end();
});

router.post("/loginUser", function(req, res) {
  console.log("user login");
  console.log(req.body);
  let p;
  const quesryTogetUser =
    "SELECT password, firstName from users where email =?";
  connection = getConnection();
  connection.query(quesryTogetUser, [req.body.email], (err, rows, fields) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: ["Invalid Login"] });
    } else if (rows.length !== 0) {
      console.log("Success");
      console.log(rows);
      if (bcrypt.compareSync(req.body.password, rows[0].password)) {
        console.log("true");
        res.cookie("cookie", "user", {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = {
          username: req.body.email,
          password: req.body.pass
        };
        res.writeHead(200, {
          "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(rows));
      } else {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end();
      }
    } else {
      res.statusCode = 500;
      return res.json({ errors: ["Invalid Login"] });
    }
  });
  connection.end();
});
router.get("/userdetails/:email", (req, res) => {
  console.log("User Details " + req.params.email);
  connection = getConnection();
  connection.query(
    "SELECT * from users WHERE email =?",
    [req.params.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot get profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(rows));
    }
  );
  connection.end();
});
router.put("/userdetails/name", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE USERS SET firstName=?, lastName=?  WHERE email =?",
    [req.body.firstName, req.body.lastName, req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end();
    }
  );
  connection.end();
});

router.put("/userdetails/email", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE USERS SET email =?  WHERE email =?",
    [req.body.newEmail, req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end();
    }
  );
  connection.end();
});

router.put("/userdetails/password", (req, res) => {
  console.log(req.body);
  let hashPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
  console.log(hashPassword);
  connection = getConnection();
  connection.query(
    "UPDATE USERS SET password =?  WHERE email =?",
    [hashPassword, req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      console.log("updated");
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end();
    }
  );
  connection.end();
});

router.put("/userdetails/address", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE USERS SET address =?  WHERE email =?",
    [req.body.address, req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update address"] });
      }
      console.log("updated");
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end();
    }
  );
  connection.end();
});

router.put("/userdetails/phoneNo", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE USERS SET phoneNo =?  WHERE email =?",
    [req.body.phoneNo, req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update address"] });
      }
      console.log("updated");
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end();
    }
  );
  connection.end();
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
router.post("/user/profilePhoto", upload.single("imageFile"), (req, res) => {
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
  connection = getConnection();
  connection.query(
    "UPDATE users SET profileImage =? WHERE email =?",
    [filePath, req.body.email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot upload ProfileImage"] });
      }
      console.log("uploaded");
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end();
    }
  );
  connection.end();
});
module.exports = router;
