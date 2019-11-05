var express = require("express");
const mysql = require("mysql");
const order = express.Router();
const Database = require("../database/database");

const config = {
  host: "localhost",
  user: "root",
  password: "kavya10ka",
  database: "grubhub"
};

function getConnection() {
  return mysql.createConnection(config);
}

order.get("/searchMenu/:menu", (req, res) => {
  connection = getConnection();
  connection.query(
    "SELECT  m.id, m.name, m.zipcode,m.address, m.phoneNo ,m.cuisine FROM restaurant m JOIN menu r ON m.id = r.restaurantId where r.name = ?",
    [req.params.menu],
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

order.post("/addToCart", (req, res) => {
  connection = getConnection();
  connection.query(
    "INSERT INTO cart (itemId, itemName, quantity, price, userId) values(?,?,?,?,?)",
    [
      req.body.itemId,
      req.body.itemName,
      req.body.quantity,
      req.body.price,
      req.body.userId
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

order.get("/cart/:id", (req, res) => {
  console.log("get cart: " + req.params.id);
  connection = getConnection();
  connection.query(
    "SELECT  * from cart WHERE userId = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot get cart details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(rows));
    }
  );
  connection.end();
});

order.delete("/deletecart/:id", (req, res) => {
  console.log("delete" + req.params.id);
  connection = getConnection();
  connection.query(
    "DELETE from cart WHERE id=?",
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

order.post("/placeOrder", (req, res) => {
  console.log(req.body);
  let values = [];

  console.log(
    new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
  );
  let time = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  let database = new Database(config);
  let row1;
  database
    .query(
      "INSERT INTO orders (restaurantId, userId, status, createdAt) VALUES(?,?,?,?)",
      [req.body.restaurantId, req.body.userId, "New", time]
    )
    .then(rows => {
      return database.query(
        "SELECT id, createdAt FROM orders where restaurantId= ? and userId=? and status =? ORDER BY createdAt DESC",
        [req.body.restaurantId, req.body.userId, "New"]
      );
    })
    .then(rows => {
      row1 = rows[0];
      console.log(row1);
      req.body.items.map(item => {
        let itemArray = [
          item.itemId,
          item.itemName,
          item.quantity,
          parseFloat(item.price),
          row1.id
        ];
        values.push(itemArray);
      });
      console.log(values);
      return database.query(
        "INSERT INTO orderItem (itemId, itemName, quantity, price, orderId) VALUES ?",
        [values]
      );
    })
    .then(rows => {
      return database.close();
    })
    .then(() => {
      res.statusCode = 200;
      return res.json("Successfully placed order");
    });
});

order.delete("/deletecartall/:id", (req, res) => {
  console.log("deleteAll " + req.params.id);
  connection = getConnection();
  connection.query(
    "DELETE from cart WHERE userId=?",
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

order.get("/getOrders/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  connection = getConnection();
  connection.query(
    "Select o.id, o.status,o.createdAt, u.firstName, u.lastName, u.phoneNo, u.address from orders o join users u on u.id = o.userId where o.restaurantId = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(rows));
    }
  );
  connection.end();
});

order.get("/owner/orderItems/:id", (req, res) => {
  console.log("get orders items " + req.params.id);
  connection = getConnection();
  connection.query(
    "SELECT * FROM orderItem where orderId = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(rows));
    }
  );
  connection.end();
});

order.put("/owner/updateOrderStatus", (req, res) => {
  console.log(req.body);
  connection = getConnection();
  connection.query(
    "UPDATE orders SET status =? where id =?",
    [req.body.status, req.body.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update order details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("Sucessfully Updated");
    }
  );
  connection.end();
});

order.get("/user/getOrders/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  connection = getConnection();
  connection.query(
    "SELECT o.id, o.status, o.createdAt, r.name from orders o join restaurant r on r.id = o.restaurantId where o.userId =?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(rows));
    }
  );
  connection.end();
});

order.get("/user/getItems/:id", (req, res) => {
  console.log("get orders " + req.params.id);
  connection = getConnection();
  connection.query(
    "SELECT o.id, oi.itemName, oi.quantity, oi.price from orders o join orderItem oi on o.id = oi.orderId where o.userId =?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ errors: ["Cannot update profile details"] });
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(rows));
    }
  );
  connection.end();
});

module.exports = order;
