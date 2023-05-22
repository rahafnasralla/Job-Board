const express = require("express");
const db = require('./connection')
const app = express();
const bodyParser = require('body-parser')

//connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection done");
});

app.use(bodyParser.json());


app.use('/api',require('./routes/api'))

app.listen("3000", () => {
  console.log("Server is successfully running on port 3000");
});


