import type { Express } from "express";
import auth from "./controllers/auth";
import account from "./controllers/account";
import accountType from "./controllers/accountType";
import transaction from "./controllers/transaction";
import budget from "./controllers/budget";

export default function routes(app: Express) {
  app.use("/v1", auth);
  app.use("/v1", account);
  app.use("/v1", accountType);
  app.use("/v1", transaction);
  app.use("/v1", budget);
}
