// Author: Amos Mwongela
// Email: amosmwongelah@gmail.com
// File: service.ts
// Acknowledgements: TheJitu
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();
import sendMail from "../helpers/email";

export const onSignUp = async (name: string, email: string) => {
  ejs.renderFile(
    "templates/onsignups.ejs",
    { name },

    async (error, data) => {
      let messageOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Thank you for signing up!!!",
        html: data,
      };

      try {
        await sendMail(messageOption);
        console.log("Email is Sent");
      } catch (error) {
        console.log(error);
      }
    }
  );
};

export const onNewProject = async (
  email: string,
  name: string,
  project: string,
  date: string
) => {
  ejs.renderFile(
    "templates/onassignment.ejs",
    { name, project, date },

    async (error, data) => {
      let messageOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "A new project is available.Check your portal",
        html: data,
      };

      try {
        await sendMail(messageOption);
        console.log("Email sent");
      } catch (error) {
        console.log(error);
      }
    }
  );
};

export const onCompletion = async (
  email: string,
  name: string,
  project: string,
  date: string
) => {
  ejs.renderFile(
    "templates/completion.ejs",
    { name, project, date },

    async (error, data) => {
      let messageOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Project Completion",
        html: data,
      };

      try {
        await sendMail(messageOption);
        console.log("Email is Sent");
      } catch (error) {
        console.log(error);
      }
    }
  );
};
