import dotenv from "dotenv";
dotenv.config();

export let configOptions = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
};
