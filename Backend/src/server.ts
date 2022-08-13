import express, { NextFunction, Request, Response, json } from "express";
import {signinUser, signupUser} from "./controllers/controller"
import router from "./routes/routes";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use("/login",signupUser)
app.use("/signup", signinUser)

app.use("/users", router);

app.use("/projects", router);

app.listen(process.env.PORT, () => {
  console.log(`App running  on port ${port}...`);
});
