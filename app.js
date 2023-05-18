const express = require("express");
const mysql = require("mysql");

const app = express();

//Create Connections

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jobboard",
});

//connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection done");
});

app.listen("3000", () => {
  console.log("Server is successfully running on port 3000");
});

