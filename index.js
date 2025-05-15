const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "akibp.h.filess.io",
  user: "recipes_parkstart",
  password: "b2ae33fd300e4fd8e601ff6627056664eb32ef26",
  database: "recipes_parkstart",
  port: 3305,
});

// Get highest rated recipes
app.get("/", (_req, res) => {
  con.query(
    "SELECT id, image_url, name, description FROM recipes ORDER BY rating DESC LIMIT 3",
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// Get information of the specified recipe
app.post("/recipe", (req, res) => {
  const recipe_id = req.body["recipe_id"];
  con.query(
    "SELECT id, image_url, name, instructions, description FROM recipes WHERE id = ? LIMIT 1",
    [recipe_id],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
