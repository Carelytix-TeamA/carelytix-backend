import { User } from "@carelytix/db";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
