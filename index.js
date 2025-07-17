const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Get highest rated recipes
app.get("/getMostPopular", (_req, res) => {
  con.query(
    "SELECT id, image_url, name, description FROM recipes ORDER BY rating DESC LIMIT 3",
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// Get most recent recipes
app.get("/getMostRecent", (_req, res) => {
  con.query(
    "SELECT id, image_url, name, description FROM recipes ORDER BY created_at DESC LIMIT 3",
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// Get information of the specified recipe
app.get("/recipe", (req, res) => {
  const recipe_id = req.query.recipe_id;
  con.query(
    "SELECT id, image_url, name, description FROM recipes WHERE id = ?",
    [recipe_id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// Get instructions for the specified recipe
app.get("/getInstructions", (req, res) => {
  const recipe_id = req.query.recipe_id;
  con.query(
    "SELECT instruction_text FROM instructions WHERE recipe_id = ?",
    [recipe_id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// Get ingredients for the specified recipe
app.get("/getIngredients", (req, res) => {
  const recipe_id = req.query.recipe_id;
  con.query(
    "SELECT name, quantity, unit, additional_info FROM ingredients WHERE recipe_id = ?",
    [recipe_id],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    }
  );
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
