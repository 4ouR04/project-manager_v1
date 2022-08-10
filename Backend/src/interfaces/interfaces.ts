import { Request, RequestHandler, Response } from "express";

export interface ProjectExtendedRequest extends Request {
  body: {
    Project: string;
    Due_date: Date;
    Description: string;
    Status: string;
  };
}

export interface UserExtendedRequest extends Request {
  body: {
    Email: string;
    Password: string;
    Name: string;
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
