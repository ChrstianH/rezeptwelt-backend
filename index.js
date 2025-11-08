const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const { Client } = require("basic-ftp");
const { downloadTo } = require("basic-ftp/dist/transfer");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;
const downloadPicture = async (picUrl) => {
  const ftpClient = new Client(0);
  console.log(picUrl, "<- picUrl", 18);

  const picDirs = picUrl.split("/");
  console.log(picDirs.slice(1), "<- picDirs.slice(1)", 19);
  picDirs.shift();
  picDirs.shift();
  const remotePath = "/rezeptwelt/" + picUrl;
  const localPath = path.join(__dirname, "rezeptwelt", picDirs.join("/"));
  console.log(remotePath, "<- remotePath", 24);
  console.log(localPath, "<- localPath", 25);
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  const content = fs.readdirSync(path.dirname(localPath), { recursive: true });
  console.log(content, "<- content", 28);
  content.forEach((file) => {
    console.log(file.entries, "<- file", 30);
  });
  try {
    await ftpClient.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
      mode: "passive",
      port: process.env.FTP_PORT,
    });

    await ftpClient.downloadTo(localPath, remotePath);
    console.log(`Datei erfolgreich heruntergeladen: ${remotePath}`);
  } catch (err) {
    console.error("Fehler beim FTP-Download:", err);
  } finally {
    ftpClient.close();
  }
};

app.get("/", (req, res) => {
  res.send("Hello from Rezeptwelt Backend!");
});

app.get("/getImage", async (req, res) => {
  const imageName = req.query.imageName;
  console.log(imageName);
  await downloadPicture(imageName);
  //res.send(filePath, (err) => {
  //res.sendFile(filePath, (err) => {
  //  if (err) {
  //    console.error("Fehler beim Senden der Datei:", err);
  //    res.status(500).send("Datei nicht gefunden.");
  //  }
  //});
});

async function example() {
  const ftpClient = new Client(0);
  try {
    await ftpClient.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true,
      port: process.env.FTP_PORT,
    });
    console.log(await ftpClient.list("/rezeptwelt"));
    await ftpClient.uploadFrom("README.md", "README_FTP.md");
    await ftpClient.downloadTo("README_COPY.md", "README_FTP.md");
  } catch (err) {
    console.log(err);
  }
  ftpClient.close();
}

// example();

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
      console.log(result[0].image_url);
      downloadPicture(result[0].image_url);
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

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
