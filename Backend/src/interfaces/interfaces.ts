import { Request, RequestHandler, Response } from "express";

export interface ProjectExtendedRequest extends Request {
  body: {
    ProjectName: string;
    Due_date: Date;
    Description: string;
    Status: string;
  };
}

export interface UserExtendedRequest extends Request {
  body: {
    Name: string;
    Email: string;
    Password: string;
  };
}

export interface User {
  Id: string;
  Email: string;
  Password: string;
}

export interface Data {
  Id: string;
  Email: string;
  Name: string;
  Role: string;
  iat: number;
  exp: number;
}
