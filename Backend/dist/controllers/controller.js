"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.getProjects = exports.insertProject = exports.signin = exports.signup = void 0;
const uuid_1 = require("uuid");
const Config_1 = require("../config/Config");
const UserValidator_1 = require("../Helpers/UserValidator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = (0, uuid_1.v4)();
        const { Name, Email, Password, Role, isAssigned } = req.body;
        const { error, value } = UserValidator_1.userSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        else {
            const hashedpassword = yield bcrypt_1.default.hash(Password, 10);
            let details = {
                UserId: Id,
                Name: Name,
                Email: Email,
                Password: hashedpassword,
                Role: "User",
                isAssigned: false,
            };
            let sql = "INSERT INTO Users SET ?";
            let query = Config_1.db.query(sql, details, (err) => {
                if (err) {
                    return res.json({ err: err.message });
                }
                res.send("Account created");
            });
        }
    }
    catch (error) {
        return res.json({ error });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email, Password } = req.body;
        const { error, value } = UserValidator_1.UserSchema1.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        else {
            let query = `SELECT * FROM Users WHERE Email = "${Email}"`;
            let user = Config_1.db.query(query, (Error, User) => __awaiter(void 0, void 0, void 0, function* () {
                if (Error) {
                    return res.json({ err: Error.message });
                }
                if (!User[0]) {
                    res.send({ message: "User Not Found" });
                    return false;
                }
                else {
                    const validPassword = yield bcrypt_1.default.compare(Password, User[0].Password);
                    if (!validPassword) {
                        res.send({ Message: "Recheck the password and try again" });
                        return false;
                    }
                    else {
                        const payload = User.map((item) => {
                            const { Password } = item, rest = __rest(item, ["Password"]);
                            return rest;
                        });
                        const token = jsonwebtoken_1.default.sign(payload[0], process.env.KEY, {
                            expiresIn: "3600s",
                        });
                        res.json({
                            Message: "Logged in successfully check projects assigned to you",
                            token,
                        });
                    }
                }
            }));
        }
    }
    catch (error) { }
});
exports.signin = signin;
// ***********************************PRROJECTS**********************
const insertProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = (0, uuid_1.v4)();
        const { ProjectName, Description, Due_date, User } = req.body;
        const { error, value } = UserValidator_1.projectSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        else {
            let details = {
                ProjectId: Id,
                ProjectName: ProjectName,
                Description: Description,
                Due_date: Due_date,
                Status: "Pending",
            };
            let sql = "INSERT INTO Projects SET ?";
            let query = Config_1.db.query(sql, details, (err) => {
                if (err) {
                    return res.json({ err: err.message });
                }
                res.json({
                    Message: `Project has been created successfully!!`,
                });
            });
        }
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.insertProject = insertProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allprojects = "SELECT * FROM Projects";
        Config_1.db.query(allprojects, (err, projects) => {
            if (err) {
                return err;
            }
            res.json(projects);
        });
        // const { recordset } = projects;
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.getProjects = getProjects;
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
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        res.json({ Name: req.info.Name, Role: req.info.Role });
    }
    else {
        res.json({ Error });
    }
});
exports.checkUser = checkUser;
