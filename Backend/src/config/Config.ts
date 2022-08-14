import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql";

export let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ProjectManager",
});

