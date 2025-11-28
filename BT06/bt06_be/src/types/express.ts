import { Request } from "express";
import { DecodedToken } from "./index";

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}
