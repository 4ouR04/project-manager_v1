import { Request, RequestHandler, Response } from "express";
import {
  UserExtendedRequest,
  ProjectExtendedRequest,
  User,
} from "../interfaces/interfaces";
import mssql from "mssql";
import { v4 as uid } from "uuid";
import { sqlConfig } from "../config/Config";
import { UserSchema, UserSchema2 } from "../Helpers/UserValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupUser = async (req: UserExtendedRequest, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const Id = uid();
    const { Email, Password, Name } = req.body;
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    }
    const hashedpassword = await bcrypt.hash(Password, 10);
    await pool
      .request()
      .input("Id", mssql.VarChar, Id)
      .input("Email", mssql.VarChar, Email)
      .input("Name", mssql.VarChar, Name)
      .input("Password", mssql.VarChar, hashedpassword)
      .execute("createUser");

    res.json({ message: "Account created successfully ,go back and login" });
  } catch (Error: unknown) {
    // res.send("Theres an error");

    res.json({ Error });
  }
};

export const signinUser = async (req: UserExtendedRequest, res: Response) => {
  try {
    const { Email, Password } = req.body;
    const pool = await mssql.connect(sqlConfig);
    const { error, value } = UserSchema2.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    }
    const user: User[] = await (
      await pool
        .request()
        .input("Email", mssql.VarChar, Email)
        .execute("getUser")
    ).recordset;

    if (!user[0]) {
      return res.json({ message: "User Not Found" });
    }

    const validPassword = await bcrypt.compare(Password, user[0].Password);
    if (!validPassword) {
      return res.json({ message: "Check the password and try again" });
    }
    const payload = user.map((item) => {
      const { Password, ...rest } = item;
      return rest;
    });
    const token = jwt.sign(payload[0], process.env.KEY as string, {
      expiresIn: "3600s",
    });
    res.json({
      message: "Logged in successfully check projects assigned to you",
      token,
    });
  } catch (Error) {
    res.json({ Error });
  }
};

export const getDashboard = (req: Request, res: Response) => {
  // if (req.info) {
  //   return res.json({ message: `Welcome to the Homepage ${req.info.email}` });
  // }
  res.send("Welcome Back!!");
};

export const insertProject = async (
  req: ProjectExtendedRequest,
  res: Response
) => {
  try {
    const id = uid();
    const { Project, Description, Due_date, Status } = req.body;
    const pool = await mssql.connect(sqlConfig);
    await pool
      .request()
      .input("Id", mssql.VarChar, id)
      .input("Project", mssql.VarChar, Project)
      .input("Due_date", mssql.Date, Due_date)
      .input("Description", mssql.VarChar, Description)
      .input("Status", mssql.VarChar, Status)
      .execute("insertProjects");

    res.json({ message: `Project has been created successfully!!` });
  } catch (Error) {
    res.json({ Error });
  }
};

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const Projects = await pool.request().execute("getProjects");
    const { recordset } = Projects;
    res.json(recordset);
  } catch (Error) {
    res.json({ Error });
  }
};

export const getProject: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const Id = req.params.id;
    const pool = await mssql.connect(sqlConfig);
    const Projects = await pool
      .request()
      .input("id", mssql.VarChar, Id)
      .execute("getProject");
    const { recordset } = Projects;
    if (!Projects.recordset[0]) {
      res.json({ message: `Project with id ${Id} cannot be found` });
    } else {
      res.json(recordset);
    }
  } catch (Error) {
    res.json({ Error });
  }
};

export const updateProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const Id = req.params.id;
    const pool = await mssql.connect(sqlConfig);
    const { Project, Description, Due_date, Status } = req.body as {
      Project: string;
      Due_date: string;
      Description: string;
      Status: string;
    };
    const Projects = await pool
      .request()
      .input("Id", mssql.VarChar, Id)
      .execute("getProject");
    if (!Projects.recordset[0]) {
      res.json({ message: `Project with id ${Id} cannot be found` });
    } else {
      await pool
        .request()
        .input("Id", mssql.VarChar, Id)
        .input("Project", mssql.VarChar, Project)
        .input("Due_date", mssql.Date, Due_date)
        .input("Description", mssql.VarChar, Description)
        .input("Status", mssql.VarChar, Status)
        .execute("updateProject");
      res.json({ message: `Project has been updated` });
    }
  } catch (Error: unknown) {
    res.json({ Error });
  }
};

export const deleteProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const Id = req.params.id;
    const pool = await mssql.connect(sqlConfig);

    const Projects = await pool
      .request()
      .input("Id", mssql.VarChar, Id)
      .execute("getProject");
    if (!Projects.recordset[0]) {
      res.json({ message: `Project with id ${Id} cannot be found` });
    } else {
      await pool
        .request()
        .input("Id", mssql.VarChar, Id)
        .execute("deleteProject");
      res.json({ message: `Project has been deleted` });
    }
  } catch (Error: unknown) {
    res.json({ Error });
  }
};
