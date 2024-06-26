import type { Express } from "express";
import auth from "./controllers/auth";
import account from "./controllers/account";
import accountType from "./controllers/accountType";
import transaction from "./controllers/transaction";
import budget from "./controllers/budget";
import category from "./controllers/category";

export default function routes(app: Express) {
  app.use("/api/v1", auth);
  app.use("/api/v1", account);
  app.use("/api/v1", accountType);
  app.use("/api/v1", transaction);
  app.use("/api/v1", budget);
  app.use("/api/v1", category);
}
