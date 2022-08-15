import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();
import sendMail from "../Helpers/Email";

export const SendEmailOnRegister = async (name: string, email: string) => {
  ejs.renderFile(
    "templates/registration.ejs",
    { name },

    async (error, data) => {
      let messageOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome To Mash Software",
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

export const SendEmailOnAssign = async (
  email: string,
  name: string,
  project: string,
  date: string
) => {
  ejs.renderFile(
    "templates/assignment.ejs",
    { name, project, date },

    async (error, data) => {
      let messageOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Mash Project Assignment",
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

export const SendEmailOnComplete = async (
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
