
const express = require('express');
const session = require('express-session');
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

const sessionMiddleware = session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', //run NODE_ENV = production pm2 start index.js when going live
    sameSite: true
  }
});

app.use(sessionMiddleware);
app.use(cors());
// app.use(express.urlencoded());
app.use(express.static(pubDirectory));
app.use(express.json());

// Routes
// app.get('/', (req, res) => {
//   res.send('Luigi');
// });

// Tony's code to store session
app.post('/api/checkCart', (req, res, next) => {
  console.log('/checkCart endpoint called!!!');
  console.log('/checkCart session.cartID', req.session.cartID);

  if (!req.session.cartID) {
    let sqlQuery = `INSERT INTO cart (id, created) VALUES (NULL, CURRENT_TIMESTAMP)`;
    //create new cart
    // const [result] =  
    connection.query(sqlQuery, (err, results, fields) => {
      req.session.cartID = results.insertId;
      console.log('what is req.session.cartID::::', req.session.cartID);
      console.log('what is result::::', results);
      res.json({ data: req.session.cartID });
    });
  } else {
    //find cart where id = req.sessionID
    // req.session.cartID = 'hello there';
    console.log('what is sessionID____', req.session);
    res.json({ data: req.session.cartID });
  }

});

app.get('/api/products', (req, res, next) => {
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

app.get('/api/product', (req, res, next) => {
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

app.get('/api/cartItems', (req, res, next) => {
  // const cartID = req.session.cartID;
  console.log('what is req.session in get/cartItems', req.session);
  if (req.session.cartID) {

    let query = 'SELECT ?? AS ??, ??,??, ??, ??, ??, ?? FROM ?? JOIN ?? WHERE ?? = ?? AND ?? = ?';
    let inserts = ['cartItems.id', 'cartItemID', 'productID', 'count', 'products.price', 'shortDescription', 'name',
      'image', 'cartItems', 'products', 'productID', 'products.id', 'cartItems.cartID', req.session.cartID];
    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
      if (err) return next(err);

      const output = {
        success: true,
        data: results
      }
      res.json(output);
    });
  } else {
    const output = {
      msg: 'CartID not found, empty cart sent',
      data: []
    };
    res.json(output);
  }

});

app.post('/api/cartItems', (req, res, next) => {
  // let cartID = req.session.cartID;
  console.log('/cartItems, whhat is in req.session.cartID', req.session.cartID);

  let { id, price } = req.body;
  if (!req.session.cartID) {
    let sqlQuery = `INSERT INTO cart (id, created) VALUES (NULL, CURRENT_TIMESTAMP)`;
    //create new cart
    // const [result] =  
    connection.query(sqlQuery, (err, results, fields) => {
      req.session.cartID = results.insertId;
      let sql = `INSERT INTO cartItems (id, productID, count, price, added, updated, cartID) 
      VALUES (NULL, ${id}, 1, ${price}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${req.session.cartID})`;

      connection.query(sql, (err, results, fields) => {
        if (err) return next(err);

        const output = {
          success: true,
          data: results
        }
        res.json(output);
      });
    });


  } else {

    // let query = 'SELECT ??, ??, ??, ??, ??, ?? FROM ?? JOIN ?? WHERE ?? = ??';
    // let inserts = ['cartItems.id', 'count', 'products.price', 'shortDescription', 'name', 
    //                'image', 'cartItems', 'products', 'productID', 'products.id'];
    // let sql = mysql.format(query, inserts);
    let sql = `INSERT INTO cartItems (id, productID, count, price, added, updated, cartID) 
             VALUES (NULL, ${id}, 1, ${price}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${req.session.cartID})`;

    connection.query(sql, (err, results, fields) => {
      if (err) return next(err);

      const output = {
        success: true,
        data: results
      }
      res.json(output);
    });
  }
});

app.patch('/api/cartItems', (req, res, next) => {
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

app.delete('/api/cartItems', (req, res, next) => {
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
app.use(function (err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(err.status || 500).json("Something broke!");
  }
  next();
});

app.listen(PORT, () => {
  console.log("Server started on PORT: ", PORT);
});
