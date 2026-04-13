import { Session } from "../lib/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: Session["user"];
    session?: Session["session"];
  }
}
