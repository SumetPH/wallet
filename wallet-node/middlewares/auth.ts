import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "") || undefined;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY || "", (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }

      req.userId = (decoded as any).user_id;
      next();
    });
  } else {
    return res.status(401).send("token not found");
  }
}
