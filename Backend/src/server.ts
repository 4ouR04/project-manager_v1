import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response, json } from "express";
import router from "./routes/projectRoutes";
const app = express();

app.use(json());
const port = process.env.PORT;
app.use("/projects", router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({ Error: err.message });
});
app.listen(process.env.PORT, () => {
  console.log(`App running  on port ${port}...`);
});
