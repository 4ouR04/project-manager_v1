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
exports.checkUser = exports.deleteProject = exports.completeProject = exports.updateProject = exports.getProject = exports.getCompletedProjects = exports.getProjects = exports.insertProject = exports.getUsers = exports.signin = exports.signup = void 0;
const uuid_1 = require("uuid");
const Config_1 = require("../config/Config");
const UserValidator_1 = require("../Helpers/UserValidator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// *************************CREATE ACCOUNT**********************************************
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
// **************************LOGIN **********************************************
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
// *************************************GET USER************************************************************
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = `SELECT Name FROM Users WHERE isAssigned= false`;
        let query = Config_1.db.query(user, (error, users) => {
            if (error) {
                res.json({ error });
            }
            else {
                res.json({ Users: users });
            }
        });
    }
    catch (error) {
        res.json({ error });
    }
});
exports.getUsers = getUsers;
// ***********************************INSERT PRROJECT******************************************************
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
// **************************GET ONE PROJECT*************************************
// 
// 
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
const getCompletedProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let completed = `SELECT * FROM Projects WHERE Status="Completed"`;
        let query = Config_1.db.query(completed, (err, data) => {
            if (err) {
                return err;
            }
            else {
                res.json({ data });
            }
        });
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.getCompletedProjects = getCompletedProjects;
// **************************************************************************************
// *********************************GET ONE PROJECT*************************************
// *******************USER SEE'S HIS / HER PROJECT ONCE LOGGED  IN*****************
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        let project = `SELECT * FROM Projects WHERE UserId="${Id}"`;
        let query = Config_1.db.query(project, (err, data) => {
            if (err) {
                res.json({ err });
            }
            else {
                res.json({ Message: "Here is your project" });
            }
        });
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.getProject = getProject;
// ******************************************************************************
// ****************************UPDATE PROJECT********************************************
// **********************ADMIN CHANGES PROJECT DETAILS***************************
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        const { ProjectName, Description, Due_date, Status } = req.body;
        let details = {
            ProjectId: Id,
            ProjectName: ProjectName,
            Description: Description,
            Due_date: Due_date,
            Status: "Pending",
        };
        let updated = `UPDATE Projects SET ? WHERE ProjectId = "${Id}"`;
        let query = Config_1.db.query(updated, details, (err) => {
            if (err) {
                return res.json({ err: err.message });
            }
            res.json({
                Message: `Project has been updated successfully!!`,
            });
        });
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.updateProject = updateProject;
// ***********************************************************************************************************
// *****************************COMPLETE PROJECT***************************************************************************
// *************************USER COMPLETES PROJECT************************************
const completeProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        let details = {
            Status: "Completed",
        };
        let completed = `UPDATE Projects SET ? WHERE ProjectId = "${Id}"`;
        let query = Config_1.db.query(completed, details, (err) => {
            if (err) {
                return res.json({ err: err.message });
            }
            res.json({
                Message: `Project has been completed!!!`,
            });
        });
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.completeProject = completeProject;
// *************************************************************************************************************
// **************************DELETE PROJECT*************************************
// **********************ADMIN DELETES PROJECT*************************************
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        let sql = `DELETE FROM Projects WHERE ProjectId="${Id}"`;
        Config_1.db.query(sql, (err, data) => {
            if (err) {
                return err;
            }
            else {
                res.json({ data });
            }
        });
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.deleteProject = deleteProject;
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        res.json({ Name: req.info.Name, Role: req.info.Role });
    }
    else {
        res.json({ Error });
    }
});
exports.checkUser = checkUser;
// ****************************END***********************************************
