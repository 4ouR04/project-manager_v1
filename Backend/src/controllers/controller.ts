// Author: Amos Mwongela
// Email: amosmwongelah@gmail.com
// Acknowledgements: TheJitu.com
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
// *************************CREATE ACCOUNT**********************************************
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
// **************************LOGIN **********************************************
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
// *************************************GET USER************************************************************
export const getUsers = async (req: Request, res: Response) => {
  try {
    let user = `SELECT Name FROM Users WHERE isAssigned= false`
    let query = db.query(user, (error, users) => {
      if (error) {
        res.json({error})
      }else{
        res.json({Users: users})
      }
    })
  } catch (error) {
    res.json({error})
  }
}
// ************************************ASSIGN PROJECT***************************************************
// ***********************************INSERT PRROJECT******************************************************
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
// **************************GET ONE PROJECT*************************************
// 
// 
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

export const getCompletedProjects = async (req: Request, res: Response) => {
  try {
    let completed = `SELECT ProjectName FROM Projects WHERE Status="Completed"`;
    let query = db.query(completed, (err, data) => {
      if (err) {
        return err;
      } else {
        res.json(data);
      }
    });
  } catch (Error) {
    res.json({ Error });
  }
};
// **************************************************************************************
// *********************************GET ONE PROJECT*************************************
// *******************USER SEE'S HIS / HER PROJECT ONCE LOGGED  IN*****************
export const getProject: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const Id = req.params.id;

    let project = `SELECT * FROM Projects WHERE UserId="${Id}"`;
    let query = db.query(project, (err, data) => {
      if (err) {
        res.json({ err });
      } else {
        res.json({ Message: "Here is your project" });
      }
    });
  } catch (Error) {
    res.json({ Error });
  }
};

// ******************************************************************************
// ****************************UPDATE PROJECT********************************************
// **********************ADMIN CHANGES PROJECT DETAILS***************************
export const updateProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const Id = req.params.id;
    const { ProjectName, Description, Due_date, Status } = req.body as {
      ProjectName: string;
      Description: string;
      Due_date: string;
      Status: string;
    };
    let details = {
      ProjectId: Id,
      ProjectName: ProjectName,
      Description: Description,
      Due_date: Due_date,
      Status: "Pending",
    };
    let updated = `UPDATE Projects SET ? WHERE ProjectId = "${Id}"`;
    let query = db.query(updated, details, (err) => {
      if (err) {
        return res.json({ err: err.message });
      }

      res.json({
        Message: `Project has been updated successfully!!`,
      });
    });
  } catch (Error: unknown) {
    res.json({ Error });
  }
};
// ***********************************************************************************************************
// *****************************COMPLETE PROJECT***************************************************************************
// *************************USER COMPLETES PROJECT************************************
export const completeProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const Id = req.params.id;
    let details = {
      Status: "Completed",
    };
    let completed = `UPDATE Projects SET ? WHERE ProjectId = "${Id}"`;
    let query = db.query(completed, details, (err) => {
      if (err) {
        return res.json({ err: err.message });
      }

      res.json({
        Message: `Project has been completed!!!`,
      });
    });
  } catch (Error: unknown) {
    res.json({ Error });
  }
};
// *************************************************************************************************************
// **************************DELETE PROJECT*************************************
// **********************ADMIN DELETES PROJECT*************************************
export const deleteProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const Id = req.params.id;
    let sql = `DELETE FROM Projects WHERE ProjectId="${Id}"`;
    db.query(sql, (err, data) => {
      if (err) {
        return err;
      } else {
        res.json({ data });
      }
    });
  } catch (Error: unknown) {
    res.json({ Error });
  }
};

export const checkUser = async (req: Extended, res: Response) => {
  if (req.info) {
    res.json({ Name: req.info.Name, Role: req.info.Role });
  } else {
    res.json({ Error });
  }
};
// ****************************END***********************************************
