import express, { json } from "express";
// import router from "./routes/projectRoutes";
const app = express();
app.use(json());
app.use("/Project", router);
app.use((err, req, res, next) => {
  res.json({ Error: err.message });
});
app.listen(3000, () => {
  console.log("App is Running");
});
