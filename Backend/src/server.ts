import express, { NextFunction, Request, Response, json } from "express";
import router from "./routes/projectRoutes";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

const port = process.env.PORT || 3000;

app.use("/projectmanager", router);

app.listen(process.env.PORT, () => {
  console.log(`App running  on port ${port}...`);
});
