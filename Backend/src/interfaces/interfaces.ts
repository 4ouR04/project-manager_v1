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
    email: string;
    password: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  password: string;
}
