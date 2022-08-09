import { Request, RequestHandler, Response } from "express";
import mssql from "mssql";
import { v4 as uid } from "uuid";
import { sqlConfig } from "../config/Config";

interface ExtendedRequest extends Request {
  body: {
    Project: string;
    Due_date: Date;
    Description: string;
    Status: string;
  };
}
export const insertProject = async (req: ExtendedRequest, res: Response) => {
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
  } catch (error) {
    res.json({ error });
  }
};

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const Projects = await pool.request().execute("getProjects");
    const { recordset } = Projects;
    res.json(recordset);
  } catch (error) {
    // res.json({ error });
    res.send(`Cant connect`);
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
  } catch (error) {
    res.json({ error });
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
  } catch (error: any) {
    res.json({ error });
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
  } catch (error: any) {
    res.json({ error });
  }
};
