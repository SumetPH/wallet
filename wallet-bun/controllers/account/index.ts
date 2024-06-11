import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import { sql } from "kysely";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/account", auth, async (req, res) => {
  try {
    const accountType = await db
      .selectFrom("wallet_account_type")
      .selectAll()
      .orderBy("wallet_account_type.account_type_id asc")
      .execute();

    const accountsList = [];

    for (const at of accountType) {
      let accounts = await db
        .selectFrom("wallet_account")
        .select([
          "wallet_account.account_id",
          "wallet_account.account_name",
          "wallet_account.account_type_id",
          "wallet_account.account_created_at",
          "wallet_account.account_updated_at",
          "wallet_account.account_balance",
          sql`coalesce(sum(case when wallet_category_type.category_type_id = '1' then wallet_transaction.transaction_amount else 0 end), 0)`.as(
            "expense"
          ),
          sql`coalesce(sum(case when wallet_category_type.category_type_id = '2' then wallet_transaction.transaction_amount else 0 end), 0)`.as(
            "income"
          ),
          sql`
           wallet_account.account_balance + 
           coalesce(sum(case when wallet_category_type.category_type_id = '2' then wallet_transaction.transaction_amount else 0 end), 0) - 
           coalesce(sum(case when wallet_category_type.category_type_id = '1' then wallet_transaction.transaction_amount else 0 end), 0)
          `.as("balance"),
        ])
        .leftJoin(
          "wallet_transaction",
          "wallet_transaction.account_id",
          "wallet_account.account_id"
        )
        .leftJoin(
          "wallet_category",
          "wallet_category.category_id",
          "wallet_transaction.category_id"
        )
        .leftJoin(
          "wallet_category_type",
          "wallet_category_type.category_type_id",
          "wallet_category.category_type_id"
        )
        .where("wallet_account.user_id", "=", req.userId)
        .where("wallet_account.account_type_id", "=", at.account_type_id)
        .groupBy("wallet_account.account_id")
        .orderBy("wallet_account.account_name asc")
        .execute();

      // sum account type balance
      const accountTypeBalance = accounts
        .reduce((prev, curr) => prev + Number(curr.balance), 0)
        .toFixed(2);

      accountsList.push({
        ...at,
        account_type_balance: accountTypeBalance,
        accounts,
      });
    }

    return res.status(200).json(accountsList);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/account", auth, async (req, res) => {
  try {
    const bodySchema = z.object({
      account_name: z.string().min(1),
      account_type_id: z.string().min(1),
      account_balance: z.string().min(1),
      account_start_date: z.string().datetime(),
    });

    const body = await bodySchema.parse(req.body);

    const newAccount = await db
      .insertInto("wallet_account")
      .values({
        account_id: uuid(),
        account_name: body.account_name,
        account_type_id: body.account_type_id,
        user_id: req.userId,
        account_balance: body.account_balance,
        account_created_at: body.account_start_date,
      })
      .executeTakeFirstOrThrow();

    return res.status(200).json(newAccount);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/account", auth, async (req, res) => {
  try {
    const bodySchema = z.object({
      account_id: z.string().min(1),
      account_name: z.string().min(1),
      account_type_id: z.string().min(1),
      account_balance: z.string().min(1),
      account_start_date: z.string().datetime(),
    });
    const body = await bodySchema.parse(req.body);
    await db
      .updateTable("wallet_account")
      .set({
        account_name: body.account_name,
        account_type_id: body.account_type_id,
        account_balance: body.account_balance,
        account_created_at: body.account_start_date,
        account_updated_at: new Date(),
      })
      .where("account_id", "=", body.account_id)
      .where("user_id", "=", req.userId)
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/account", auth, async (req, res) => {
  try {
    const bodySchema = z.object({
      account_id: z.string().min(1),
    });
    const body = await bodySchema.parse(req.body);

    await db
      .deleteFrom("wallet_transaction")
      .where("account_id", "=", body.account_id)
      .execute();

    await db
      .deleteFrom("wallet_account")
      .where("account_id", "=", body.account_id)
      .where("user_id", "=", req.userId)
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default router;
