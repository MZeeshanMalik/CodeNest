import { Request } from "express";
import UserTypes from "./UserTypes";

export interface AuthenticatedRequest extends Request {
  user: UserTypes;
}
