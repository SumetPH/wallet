import type { Express } from "express";
import auth from "./controllers/auth";
import account from "./controllers/account";
import accountType from "./controllers/accountType";
import Transaction from "./controllers/transaction";

export default function routes(app: Express) {
  app.use("/v1", auth);
  app.use("/v1", account);
  app.use("/v1", accountType);
  app.use("/v1", Transaction);
}
