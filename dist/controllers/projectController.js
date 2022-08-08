var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mssql from "mssql";
import { v4 as uid } from "uuid";
import { sqlConfig } from "../config/Config";
export const insertProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = uid();
        const { Project, description } = req.body;
        const pool = yield mssql.connect(sqlConfig);
        yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .input("Project", mssql.VarChar, Project)
            .input("description", mssql.VarChar, description)
            .execute("insertProjects");
        res.json({ message: "Project Inserted Successfully" });
    }
    catch (error) {
        res.json({ error });
    }
});
export const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql.connect(sqlConfig);
        const Projects = yield pool.request().execute("getProjects");
        const { recordset } = Projects;
        res.json(recordset);
    }
    catch (error) {
        res.json({ error });
    }
});
export const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql.connect(sqlConfig);
        const Projects = yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("getProject");
        const { recordset } = Projects;
        if (!Projects.recordset[0]) {
            res.json({ message: "Project Not Found" });
        }
        else {
            res.json(recordset);
        }
    }
    catch (error) {
        res.json({ error });
    }
});
export const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql.connect(sqlConfig);
        const { Project, description } = req.body;
        const Projects = yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("getProject");
        if (!Projects.recordset[0]) {
            res.json({ message: "Project Not Found" });
        }
        else {
            yield pool
                .request()
                .input("id", mssql.VarChar, id)
                .input("Project", mssql.VarChar, Project)
                .input("description", mssql.VarChar, description)
                .execute("updateProject");
            res.json({ message: "Project Updated ..." });
        }
    }
    catch (error) {
        res.json({ error });
    }
});
export const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql.connect(sqlConfig);
        const Projects = yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("getProject");
        if (!Projects.recordset[0]) {
            res.json({ message: "Project Not Found" });
        }
        else {
            // await pool.request().query(`DELETE FROM Projects WHERE id='${id}'`)
            yield pool
                .request()
                .input("id", mssql.VarChar, id)
                .execute("deleteProject");
            res.json({ message: "Project Deleted" });
        }
    }
    catch (error) {
        res.json({ error });
    }
});
