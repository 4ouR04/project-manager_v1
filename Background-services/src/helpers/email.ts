// Author: Amos Mwongela
// Email: amosmwongelah@gmail.com
// File: email.ts
// Acknowledgements: TheJitu
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { configOptions } from "../config/config";
dotenv.config();

function createTransporter(config: any) {
  const transporter = nodemailer.createTransport(config);
  return transporter;
}

const sendMail = async (messageOption: any) => {
  const transporter = createTransporter(configOptions);
  await transporter.verify();
  transporter.sendMail(messageOption, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log(info.response);
  });
};

export default sendMail;
