import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import { sql } from "kysely";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/account-list", auth, async (req, res) => {
  try {
    const accounts = await db
      .selectFrom("wallet_account")
      .leftJoin(
        "wallet_account_type",
        "wallet_account_type.account_type_id",
        "wallet_account.account_type_id"
      )
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("transactions")
            .select([
              "transactions.account_id",
              sql<string>`sum(case when category_type_id = '1' then transaction_amount else 0 end)`.as(
                "expense"
              ),
              sql<string>`sum(case when category_type_id = '2' then transaction_amount else 0 end)`.as(
                "income"
              ),
            ])
            .groupBy("transactions.account_id")
            .as("t"),
        (join) => join.onRef("t.account_id", "=", "wallet_account.account_id")
      )
      .groupBy("wallet_account_type.account_type_id")
      .orderBy("wallet_account_type.account_type_id")
      .select([
        "wallet_account_type.account_type_id",
        "wallet_account_type.account_type_name",
        "wallet_account_type.account_type_created_at",
        "wallet_account_type.account_type_updated_at",
        sql<string>`sum((coalesce(wallet_account.account_balance,0) + coalesce(t.income,0) - coalesce(t.expense,0)))`.as(
          "account_type_balance"
        ),
        sql`
          json_agg(
            json_build_object(
                'account_id', wallet_account.account_id,
                'account_name', wallet_account.account_name,
                'account_created_at', TO_CHAR(wallet_account.account_created_at, 'YYYY-MM-DD HH24:MI:SS'),
                'account_updated_at', TO_CHAR(wallet_account.account_updated_at, 'YYYY-MM-DD HH24:MI:SS'),
                'account_type_id', wallet_account_type.account_type_id,
                'account_type_name', wallet_account_type.account_type_name,
                'account_balance', wallet_account.account_balance::text,
                'expense', coalesce(t.expense, 0)::text,
                'income', coalesce(t.income, 0)::text,
                'net_balance', (coalesce(wallet_account.account_balance,0) + coalesce(t.income,0) - coalesce(t.expense,0))::text
            ) order by wallet_account.account_name
        )
        `.as("accounts"),
      ])
      .execute();

    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/account-create", auth, async (req, res) => {
  try {
    const bodySchema = z.object({
      account_name: z.string().min(1),
      account_type_id: z.string().min(1),
      account_balance: z.string().min(1),
      account_start_date: z.string().min(1),
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
    console.error(error);
    return res.status(500).json({ error });
  }
});

router.put("/account-update", auth, async (req, res) => {
  try {
    const bodySchema = z.object({
      account_id: z.string().min(1),
      account_name: z.string().min(1),
      account_type_id: z.string().min(1),
      account_balance: z.string().min(1),
      account_start_date: z.string().min(1),
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

router.delete("/account-delete", auth, async (req, res) => {
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
