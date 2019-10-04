
const express = require('express');
const mysql = require('mysql');
const credentials = require('./mysql_credentials');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;
const connection = mysql.createConnection(credentials);
const pubDirectory = path.join(__dirname, '/public');

connection.connect((err) => {
  if (err) throw err;

  console.log('Connected to database');

});

app.use(cors());
app.use(express.urlencoded());
app.use(express.static(pubDirectory));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Luigi');
});

app.get('/products', (req, res, next) => {
  let query = 'SELECT * FROM ??';
  let inserts = ['products'];
  let sql = mysql.format(query, inserts);

  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    }
    res.json(output);
  });
});

app.get('/product', (req, res, next) => {
  const id = parseInt(req.query.id);
  console.log('what is req in node:', id);

  let query = 'SELECT * FROM ?? WHERE ?? = ?';
  let inserts = ['products', 'id', id];

  let sql = mysql.format(query, inserts);

  connection.query(sql, (err, results, fields) => {
      if (err) return next(err);

      const output = {
          success: true,
          data: results
      };
      res.json(output);
  });
});

app.get('/cartItems', (req, res, next) => {
  let query = 'SELECT ?? AS ??, ??,??, ??, ??, ??, ?? FROM ?? JOIN ?? WHERE ?? = ??';
  let inserts = ['cartItems.id', 'cartItemID', 'productID', 'count', 'products.price', 'shortDescription', 'name', 
                 'image', 'cartItems', 'products', 'productID', 'products.id'];
  let sql = mysql.format(query, inserts);

  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    }
    res.json(output);
  });
});

app.post('/cartItems', (req, res, next) => {
  let { id, price } = req.body;
  // let query = 'SELECT ??, ??, ??, ??, ??, ?? FROM ?? JOIN ?? WHERE ?? = ??';
  // let inserts = ['cartItems.id', 'count', 'products.price', 'shortDescription', 'name', 
  //                'image', 'cartItems', 'products', 'productID', 'products.id'];
  // let sql = mysql.format(query, inserts);
  let sql = `INSERT INTO cartItems (id, productID, count, price, added, updated, cartID) 
             VALUES (NULL, ${id}, 1, ${price}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)`;

  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    }
    res.json(output);
  });
});

app.patch('/cartItems', (req, res, next) => {
  let { cartItemID, count } = req.body;
  // let query = 'SELECT ??, ??, ??, ??, ??, ?? FROM ?? JOIN ?? WHERE ?? = ??';
  // let inserts = ['cartItems.id', 'count', 'products.price', 'shortDescription', 'name', 
  //                'image', 'cartItems', 'products', 'productID', 'products.id'];
  // let sql = mysql.format(query, inserts);
  let sql = `UPDATE cartItems SET count = ${count}, updated = CURRENT_TIMESTAMP WHERE cartItems.id = ${cartItemID}`;

  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    }
    res.json(output);
  });
});

app.delete('/cartItems', (req, res, next) => {
  const cartItemID = parseInt(req.body.cartItemID);
  let query = 'DELETE FROM ?? WHERE ?? = ?';
  let inserts = ['cartItems', 'id', cartItemID];
  let sql = mysql.format(query, inserts);

  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    }
    res.json(output);
  });
});


// Error Handling Middleware
app.use(function(err, req, res, next){
  if (err) {
    console.error(err);
    res.status(err.status || 500).json("Something broke!");
  }
  next();
});

app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
