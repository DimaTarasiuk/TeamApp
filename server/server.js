import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "1000",
  database: "mydb"
});

const handleDatabaseQuery = (tableName, res) => {
  db.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
};

app.get("/userinfo", (req, res) => {
  handleDatabaseQuery("userinfo", res);
});

app.get("/mistake", (req, res) => {
  handleDatabaseQuery("mistake", res);
});

app.get("/meeting", (req, res) => {
  handleDatabaseQuery("meeting", res);
});

app.get("/incident", (req, res) => {
  handleDatabaseQuery("incident", res);
});


const handleUpdateDatabaseQuery = (tableName, columns) => (req, res) => {
  const userId = req.body.id;

  const values = columns.map(column => req.body[column]);

  db.query(
    `UPDATE ${tableName} SET ${columns.map(col => `\`${col}\`= ?`).join(', ')} WHERE id = ?`,
    [...values, userId],
    (err, result) => {
      if (err) return res.send(err);
      return res.json(result);
    });
};

app.put("/userinfo", handleUpdateDatabaseQuery("userinfo", ["projectTitle", "projectStatus"]));
app.put("/mistake", handleUpdateDatabaseQuery("mistake", ["mistake"]));
app.put("/meeting", handleUpdateDatabaseQuery("meeting", ["oneOnone", "weekly", "training"]));
app.put("/incident", handleUpdateDatabaseQuery("incident", ["week1", "week2", "week3", "week4"]));

app.use('/', createProxyMiddleware({ target: `http://localhost:${PORT}`, changeOrigin: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
