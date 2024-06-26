import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";

const router = express.Router();

router.get("/account-type-list", async (req, res) => {
  const accountTypes = await db
    .selectFrom("wallet_account_type")
    .selectAll()
    .orderBy("account_type_id asc")
    .execute();
  return res.json(accountTypes);
});

export default router;
