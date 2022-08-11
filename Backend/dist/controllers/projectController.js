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
exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.insertProject = exports.signinUser = exports.signupUser = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const Config_1 = require("../config/Config");
const UserValidator_1 = require("../Helpers/UserValidator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const Id = (0, uuid_1.v4)();
        const { Email, Password, Name } = req.body;
        const { error, value } = UserValidator_1.UserSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const hashedpassword = yield bcrypt_1.default.hash(Password, 10);
        yield pool
            .request()
            .input("Id", mssql_1.default.VarChar, Id)
            .input("Email", mssql_1.default.VarChar, Email)
            .input("Name", mssql_1.default.VarChar, Name)
            .input("Password", mssql_1.default.VarChar, hashedpassword)
            .execute("createUser");
        res.json({ message: "Account created successfully ,go back and login" });
    }
    catch (error) {
        res.json({ error });
    }
});
exports.signupUser = signupUser;
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email, Password } = req.body;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const { error, value } = UserValidator_1.UserSchema2.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const user = yield (yield pool
            .request()
            .input("Email", mssql_1.default.VarChar, Email)
            .execute("getUser")).recordset;
        if (!user[0]) {
            return res.json({ message: "User Not Found" });
        }
        const validPassword = yield bcrypt_1.default.compare(Password, user[0].Password);
        if (!validPassword) {
            return res.json({ message: "Invalid password" });
        }
        const payload = user.map((item) => {
            const { Password } = item, rest = __rest(item, ["Password"]);
            return rest;
        });
        const token = jsonwebtoken_1.default.sign(payload[0], process.env.KEY, {
            expiresIn: "3600s",
        });
        res.json({
            message: "Logged in successfully check projects assigned to you",
            token,
        });
    }
    catch (error) {
        res.json({ error });
    }
});
exports.signinUser = signinUser;
const insertProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const { Project, Description, Due_date, Status } = req.body;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        yield pool
            .request()
            .input("Id", mssql_1.default.VarChar, id)
            .input("Project", mssql_1.default.VarChar, Project)
            .input("Due_date", mssql_1.default.Date, Due_date)
            .input("Description", mssql_1.default.VarChar, Description)
            .input("Status", mssql_1.default.VarChar, Status)
            .execute("insertProjects");
        res.json({ message: `Project has been created successfully!!` });
    }
    catch (error) {
        res.json({ error });
    }
});
exports.insertProject = insertProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const Projects = yield pool.request().execute("getProjects");
        const { recordset } = Projects;
        res.json(recordset);
    }
    catch (error) {
        // res.json({ error });
        res.send(`Cant connect`);
    }
});
exports.getProjects = getProjects;
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
    catch (error) {
        res.json({ error });
    }
});
exports.getProject = getProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.params.id;
        const pool = yield mssql_1.default.connect(Config_1.sqlConfig);
        const { Project, Description, Due_date, Status } = req.body;
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
                .input("Project", mssql_1.default.VarChar, Project)
                .input("Due_date", mssql_1.default.Date, Due_date)
                .input("Description", mssql_1.default.VarChar, Description)
                .input("Status", mssql_1.default.VarChar, Status)
                .execute("updateProject");
            res.json({ message: `Project has been updated` });
        }
    }
    catch (error) {
        res.json({ error });
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
    catch (error) {
        res.json({ error });
    }
});
exports.deleteProject = deleteProject;
