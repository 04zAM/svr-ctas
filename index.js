const express = require("express");
const app = express();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app
  .use(express.json())
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/users", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM usuarios;");
      const results = json(result)//{ results: result ? result.rows : null };
      res.render("pages/users", results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
