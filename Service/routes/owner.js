var express = require("express");
const mysql = require("mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Database = require("../database/database");
const multer = require("multer");

const config = {
  host: "localhost",
  user: "root",
  password: "kavya10ka",
  database: "grubhub"
};
function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kavya10ka",
    database: "grubhub"
  });
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
  const queryToInsert = "INSERT INTO restaurant ( name, zipcode) values(?,?) ";
  let database = new Database(config);
  let row1, row2;
  database
    .query(queryToInsert, [restaurantName, zipCode])
    .then(rows => {
      return database.query(
        "insert into owners (firstName, lastName, email, password ) values(?,?,?,?)",
        [firstName, lastName, email, hashPassword]
      );
    })
    .then(rows => {
      return database.query(
        "select id from restaurant where name =? and zipcode =?",
        [restaurantName, zipCode]
      );
    })
    .then(rows => {
      row1 = rows;
      console.log(row1);
      return database.query("select id from owners where email=?", [email]);
    })
    .then(rows => {
      row2 = rows;
      console.log(row2);
      return database.query(
        "insert into restaurant_owner (restaurantId, ownerId) values(?,?)",
        [row1[0].id, row2[0].id]
      );
    })
    .then(rows => {
      return database.close();
    })
    .then(() => {
      return res.json({ row1: row1, row2: row2 });
    });
});

router.post("/loginOwner", function(req, res) {
  console.log("owner login");
  console.log(req.body);
  const quesryTogetUser =
    "SELECT password, firstName from owners where email =?";
  connection = getConnection();
  connection.query(quesryTogetUser, [req.body.email], (err, rows, fields) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: ["Invalid Login"] });
    } else if (rows.length !== 0) {
      console.log("Success");
      if (bcrypt.compareSync(req.body.password, rows[0].password)) {
        console.log("true");
        console.log(rows[0].firstName);
        res.cookie("cookie", "owner", {
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
router.get("/ownerdetails/:email", (req, res) => {
  console.log(req.params);
  connection = getConnection();
  connection.query(
    "SELECT * from owners WHERE email =?",
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
router.get("/restaurant/:email", (req, res) => {
  connection = getConnection();
  connection.query(
    "SELECT m.id, m.name, m.zipcode,m.address, m.phoneNo ,m.cuisine,m.image, o.firstName FROM restaurant m JOIN restaurant_owner c ON c.restaurantId = m.id JOIN owners o ON o.id= c.ownerId where o.email=?",
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

router.get("/menu/:id", (req, res) => {
  connection = getConnection();
  connection.query(
    "SELECT * from menu WHERE restaurantId =?",
    [req.params.id],
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

router.post("/createmenu", upload.single("image"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  let filePath = "";
  if (!file) {
    filePath = "";
  } else filePath = file.filename;
  console.log(filePath);
  connection = getConnection();
  connection.query(
    "INSERT INTO menu (name, description, price, section, restaurantId, image) values(?,?,?,?,?,?)",
    [
      req.body.name,
      req.body.desc,
      req.body.price,
      req.body.section,
      req.body.restaurantId,
      filePath
    ],
    (err, results, feilds) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot insert the menu details"] });
      }
      res.statusCode = 200;
      return res.json();
    }
  );
  connection.end();
});

router.put("/updatemenu", upload.single("image"), (req, res) => {
  console.log(req.body);
  const file = req.file;
  let filePath = "";
  if (!file) {
    filePath = "";
  } else filePath = file.filename;
  console.log(filePath);
  connection = getConnection();
  connection.query(
    "UPDATE menu SET name=?, description=?, price=?, section=?, image=?  WHERE id =?",
    [
      req.body.itemName,
      req.body.desc,
      req.body.price,
      req.body.section,
      filePath,
      req.body.id
    ],
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
router.delete("/deletemenu/:id", (req, res) => {
  connection = getConnection();
  connection.query(
    "DELETE from menu WHERE id=?",
    [req.params.id],
    (err, result) => {
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

router.put("/ownerdetails/name", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE owners SET firstName=?, lastName=?  WHERE email =?",
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

router.put("/ownerdetails/email", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE owners SET email =?  WHERE email =?",
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

router.put("/ownerdetails/password", (req, res) => {
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

router.put("/restaurantdetails", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE restaurant SET name =?, address=?, phoneNo=?, zipcode=?, cuisine=?  WHERE id =?",
    [
      req.body.name,
      req.body.address,
      req.body.phoneNo,
      req.body.zipcode,
      req.body.cuisine,
      req.body.id
    ],
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

router.get("/restaurant/details/:id", (req, res) => {
  connection = getConnection();
  connection.query(
    "SELECT * from restaurant WHERE id =?",
    [req.params.id],
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

router.post("/restaurant/image", upload.single("imageFile"), (req, res) => {
  const file = req.file;

  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return res.json({ errors: ["Cannot upload ProfileImage"] });
  }
  let filePath = file.filename;
  console.log(filePath);
  connection = getConnection();
  connection.query(
    "UPDATE restaurant SET image =? WHERE id =?",
    [filePath, req.body.id],
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
});

router.delete("/deleteSection/:name/:id", (req, res) => {
  console.log("get connection");
  connection = getConnection();
  connection.query(
    "DELETE from menu WHERE restaurantId=? and section = ?",
    [req.params.id, req.params.name],
    (err, result) => {
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

module.exports = router;
