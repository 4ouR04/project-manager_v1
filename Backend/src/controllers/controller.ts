import { Request, RequestHandler, Response } from "express";
import {
  Extended,
  UserExtendedRequest,
  ProjectExtendedRequest,
  User,
} from "../interfaces/interfaces";
import mssql from "mssql";
import { v4 as uid } from "uuid";
import { db } from "../config/Config";
import {
  userSchema,
  UserSchema1,
  projectSchema,
} from "../Helpers/UserValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { array } from "joi";

export const signup = async (req: Request, res: Response) => {
  try {
    const Id = uid();

    const { Name, Email, Password, Role, isAssigned } = req.body;
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.json({ error: error.details[0].message });
    } else {
      const hashedpassword = await bcrypt.hash(Password, 10);

      let details = {
        UserId: Id,
        Name: Name,
        Email: Email,
        Password: hashedpassword,
        Role: "User",
        isAssigned: false,
      };

      let sql = "INSERT INTO Users SET ?";

      let query = db.query(sql, details, (err) => {
        if (err) {
          return res.json({ err: err.message });
        }

        res.send("Account created");
      });
    }
  } catch (error) {
    return res.json({ error });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { Email, Password } = req.body;

    const { error, value } = UserSchema1.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    } else {
      let query = `SELECT * FROM Users WHERE Email = "${Email}"`;
      let user = db.query(query, async (Error, User) => {
        if (Error) {
          return res.json({ err: Error.message });
        }
        if (!User[0]) {
          res.send({ message: "User Not Found" });
          return false;
        } else {
          const validPassword = await bcrypt.compare(
            Password,
            User[0].Password
          );
          if (!validPassword) {
            res.send({ Message: "Recheck the password and try again" });
            return false;
          } else {
            const payload = User.map((item: any) => {
              const { Password, ...rest } = item;
              return rest;
            });
            const token = jwt.sign(payload[0], process.env.KEY as string, {
              expiresIn: "3600s",
            });

            res.json({
              Message: "Logged in successfully check projects assigned to you",
              token,
            });
          }
        }
      });
    }
  } catch (error) {}
};
// ***********************************PRROJECTS**********************
export const insertProject = async (
  req: ProjectExtendedRequest,
  res: Response
) => {
  try {
    const Id = uid();
    const { ProjectName, Description, Due_date, User } = req.body;
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    } else {
      let details = {
        ProjectId: Id,
        ProjectName: ProjectName,
        Description: Description,
        Due_date: Due_date,
        Status: "Pending",
      };
      let sql = "INSERT INTO Projects SET ?";
      let query = db.query(sql, details, (err) => {
        if (err) {
          return res.json({ err: err.message });
        }

        res.json({
          Message: `Project has been created successfully!!`,
        });
      });
    }
  } catch (Error) {
    res.json({ Error });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    let allprojects = "SELECT * FROM Projects";

    db.query(allprojects, (err, projects) => {
      if (err) {
        return err;
      }
      res.json(projects);
    });
    // const { recordset } = projects;
  } catch (Error) {
    res.json({ Error });
  }
};

// export const getCompletedProjects = async (req: Request, res: Response) => {
//   // try {
//   //   const pool = await mssql.connect(sqlConfig);
//   //   const Projects = await pool.request().execute("getCompletedProjects");
//   //   const { recordset } = Projects;
//   //   res.json(recordset);
//   // } catch (Error) {
//   //   res.json({ Error });
//   // }
//   res.json({
//     Name: "Python",
//     Description: "Exporting csv files",
//     Due_date: "12/09/2022",
//   });
// };

// export const getProject: RequestHandler<{ id: string }> = async (req, res) => {
//   try {
//     const Id = req.params.id;
//     const pool = await mssql.connect(sqlConfig);
//     const Projects = await pool
//       .request()
//       .input("id", mssql.VarChar, Id)
//       .execute("getProject");
//     const { recordset } = Projects;
//     if (!Projects.recordset[0]) {
//       res.json({ message: `Project with id ${Id} cannot be found` });
//     } else {
//       res.json(recordset);
//     }
//   } catch (Error) {
//     res.json({ Error });
//   }
// };

// export const updateProject: RequestHandler<{ id: string }> = async (
//   req,
//   res
// ) => {
//   try {
//     const Id = req.params.id;
//     const pool = await mssql.connect(sqlConfig);
//     const { ProjectName, Description, Due_date, Status } = req.body as {
//       ProjectName: string;
//       Due_date: string;
//       Description: string;
//       Status: string;
//     };
//     const Projects = await pool
//       .request()
//       .input("Id", mssql.VarChar, Id)
//       .execute("getProject");
//     if (!Projects.recordset[0]) {
//       res.json({ message: `Project with id ${Id} cannot be found` });
//     } else {
//       await pool
//         .request()
//         .input("Id", mssql.VarChar, Id)
//         .input("ProjectName", mssql.VarChar, ProjectName)
//         .input("Due_date", mssql.Date, Due_date)
//         .input("Description", mssql.VarChar, Description)
//         .input("Status", mssql.VarChar, Status)
//         .execute("updateProject");
//       res.json({ message: `Project has been updated` });
//     }
//   } catch (Error: unknown) {
//     res.json({ Error });
//   }
// };

// export const deleteProject: RequestHandler<{ id: string }> = async (
//   req,
//   res
// ) => {
//   try {
//     const Id = req.params.id;
//     const pool = await mssql.connect(sqlConfig);

//     const Projects = await pool
//       .request()
//       .input("Id", mssql.VarChar, Id)
//       .execute("getProject");
//     if (!Projects.recordset[0]) {
//       res.json({ message: `Project with id ${Id} cannot be found` });
//     } else {
//       await pool
//         .request()
//         .input("Id", mssql.VarChar, Id)
//         .execute("deleteProject");
//       res.json({ message: `Project has been deleted` });
//     }
//   } catch (Error: unknown) {
//     res.json({ Error });
//   }
// };

export const checkUser = async (req: Extended, res: Response) => {
  if (req.info) {
    res.json({ Name: req.info.Name, Role: req.info.Role });
  } else {
    res.json({ Error });
  }
};
