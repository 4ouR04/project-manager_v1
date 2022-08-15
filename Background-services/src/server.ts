import express, { NextFunction, Request, Response, json } from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  SendEmailOnAssign,
  SendEmailOnComplete,
  SendEmailOnRegister,
} from "./service/service";

const app = express();

app.use(json());

// Register
app.post("/registration", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  await SendEmailOnRegister(name, email);
  res.status(200).json("Email sent");
});

// Assign project
app.post("/assignment", async (req: Request, res: Response) => {
  const { email, name, project, date } = req.body;

  await SendEmailOnAssign(email, name, project, date);
  res.status(200).json("Email sent");
});

// Submit project
app.post("/submission", async (req: Request, res: Response) => {
  const { name, email, date, project } = req.body;

  await SendEmailOnComplete(email, name, project, date);
  res.status(200).json("Email sent");
});

// get port number
const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
