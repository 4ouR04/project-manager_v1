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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.deleteProject = exports.updateProject = exports.getProject = exports.getCompletedProjects = exports.getProjects = exports.insertProject = exports.signinUser = exports.signupUser = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const Config_1 = require("../config/Config");
const UserValidator_1 = require("../Helpers/UserValidator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const Id = (0, uuid_1.v4)();
        const { Name, Email, Password } = req.body;
        const { error, value } = UserValidator_1.UserSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const hashedpassword = yield bcrypt_1.default.hash(Password, 10);
        yield pool
            .request()
            .input("Id", mssql_1.default.VarChar, Id)
            .input("Name", mssql_1.default.VarChar, Name)
            .input("Email", mssql_1.default.VarChar, Email)
            .input("Password", mssql_1.default.VarChar, hashedpassword)
            .input("isAssigned", mssql_1.default.Bit, 0)
            .execute("createUser");
        res.json({ message: "Account created successfully ,go back and login" });
    }
    catch (Error) {
        // res.send("Theres an error");
        res.json({ Error });
    }
});
exports.signupUser = signupUser;
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.signinUser = signinUser;
const insertProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const { ProjectName, Description, Due_date, Status } = req.body;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        yield pool
            .request()
            .input("Id", mssql_1.default.VarChar, id)
            .input("ProjectName", mssql_1.default.VarChar, ProjectName)
            .input("Due_date", mssql_1.default.Date, Due_date)
            .input("Description", mssql_1.default.VarChar, Description)
            .input("Status", mssql_1.default.VarChar, Status)
            .execute("insertProjects");
        res.json({ message: `Project has been created successfully!!` });
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.insertProject = insertProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const pool = await mssql.connect(sqlConfig);
    //   const Projects = await pool.request().execute("getProjects");
    //   const { recordset } = Projects;
    //   res.json(recordset);
    // } catch (Error) {
    //   res.json({ Error });
    // }
    res.json({
        Name: "Nodejs",
        Description: "Export csv files",
        Due_date: "12/09/2022",
    });
});
exports.getProjects = getProjects;
const getCompletedProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const pool = await mssql.connect(sqlConfig);
    //   const Projects = await pool.request().execute("getCompletedProjects");
    //   const { recordset } = Projects;
    //   res.json(recordset);
    // } catch (Error) {
    //   res.json({ Error });
    // }
    res.json({
        Name: "Python",
        Description: "Exporting csv files",
        Due_date: "12/09/2022",
    });
});
exports.getCompletedProjects = getCompletedProjects;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const Projects = yield pool
            .request()
            .input("id", mssql_1.default.VarChar, Id)
            .execute("getProject");
        const { recordset } = Projects;
        if (!Projects.recordset[0]) {
            res.json({ message: `Project with id ${Id} cannot be found` });
        }
        else {
            res.json(recordset);
        }
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.getProject = getProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const { ProjectName, Description, Due_date, Status } = req.body;
        const Projects = yield pool
            .request()
            .input("Id", mssql_1.default.VarChar, Id)
            .execute("getProject");
        if (!Projects.recordset[0]) {
            res.json({ message: `Project with id ${Id} cannot be found` });
        }
        else {
            yield pool
                .request()
                .input("Id", mssql_1.default.VarChar, Id)
                .input("ProjectName", mssql_1.default.VarChar, ProjectName)
                .input("Due_date", mssql_1.default.Date, Due_date)
                .input("Description", mssql_1.default.VarChar, Description)
                .input("Status", mssql_1.default.VarChar, Status)
                .execute("updateProject");
            res.json({ message: `Project has been updated` });
        }
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const Projects = yield pool
            .request()
            .input("Id", mssql_1.default.VarChar, Id)
            .execute("getProject");
        if (!Projects.recordset[0]) {
            res.json({ message: `Project with id ${Id} cannot be found` });
        }
        else {
            yield pool
                .request()
                .input("Id", mssql_1.default.VarChar, Id)
                .execute("deleteProject");
            res.json({ message: `Project has been deleted` });
        }
    }
    catch (Error) {
        res.json({ Error });
    }
});
exports.deleteProject = deleteProject;
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        res.json({ name: req.info.Name, role: req.info.Role });
    }
});
exports.checkUser = checkUser;
