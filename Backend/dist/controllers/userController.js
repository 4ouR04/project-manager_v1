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
import { sqlConfig } from "../Config/Config";
export const insertUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = uid();
        const { User, description } = req.body;
        const pool = yield mssql.connect(sqlConfig);
        yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .input("User", mssql.VarChar, User)
            .input("description", mssql.VarChar, description)
            .execute("insertUsers");
        res.json({ message: "User Inserted Successfully" });
    }
    catch (error) {
        res.json({ error });
    }
});
export const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql.connect(sqlConfig);
        const Users = yield pool.request().execute("getUsers");
        const { recordset } = Users;
        res.json(recordset);
    }
    catch (error) {
        res.json({ error });
    }
});
export const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql.connect(sqlConfig);
        const Users = yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("getUser");
        const { recordset } = Users;
        if (!Users.recordset[0]) {
            res.json({ message: "User Not Found" });
        }
        else {
            res.json(recordset);
        }
    }
    catch (error) {
        res.json({ error });
    }
});
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql.connect(sqlConfig);
        const { User, description } = req.body;
        const Users = yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("getUser");
        if (!Users.recordset[0]) {
            res.json({ message: "User Not Found" });
        }
        else {
            yield pool
                .request()
                .input("id", mssql.VarChar, id)
                .input("User", mssql.VarChar, User)
                .input("description", mssql.VarChar, description)
                .execute("updateUser");
            res.json({ message: "User Updated ..." });
        }
    }
    catch (error) {
        res.json({ error });
    }
});
export const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql.connect(sqlConfig);
        const Users = yield pool
            .request()
            .input("id", mssql.VarChar, id)
            .execute("getUser");
        if (!Users.recordset[0]) {
            res.json({ message: "User Not Found" });
        }
        else {
            // await pool.request().query(`DELETE FROM Users WHERE id='${id}'`)
            yield pool.request().input("id", mssql.VarChar, id).execute("deleteUser");
            res.json({ message: "User Deleted" });
        }
    }
    catch (error) {
        res.json({ error });
    }
});
