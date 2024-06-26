import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import { sql } from "kysely";
import auth from "../../middlewares/auth";
import dayjs from "dayjs";

const router = express.Router();

router.get("/transaction-list", auth, async (req, res) => {
  try {
    const schema = z.object({
      account_id: z.string().optional(),
      category_id: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    });

    const query = await schema.parse({
      account_id: req.query.account_id,
      category_id: req.query.category_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    });

    let querySql = db
      .selectFrom("transactions")
      .select([
        sql<string>`to_char(date(transaction_created_at), 'YYYY-MM-DD')`.as(
          "date"
        ),
        sql<string>`coalesce(sum(case when category_type_id = '1' then transaction_amount else 0 end), 0)`.as(
          "expense"
        ),
        sql<string>`coalesce(sum(case when category_type_id = '2' then transaction_amount else 0 end), 0)`.as(
          "income"
        ),
        sql<string>`
        coalesce(sum(case when category_type_id = '2' then transaction_amount else 0 end), 0) - 
        coalesce(sum(case when category_type_id = '1' then transaction_amount else 0 end), 0)
      `.as("total"),
        sql<{ transaction_amount: string }[]>`
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'transaction_id', transaction_id,
              'transaction_amount', transaction_amount::text,
              'transaction_note', transaction_note,
              'transaction_created_at', to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS'),
              'category_id', category_id,
              'category_name', category_name,
              'category_type_id', category_type_id,
              'category_type_name', category_type_name,
              'account_id', account_id,
              'account_name', account_name
          ) order by transaction_created_at desc
        )
      `.as("transactions"),
      ])
      .groupBy("date")
      .orderBy("date desc")
      .where("transactions.user_id", "=", req.userId);

    if (query.account_id) {
      querySql = querySql.where("account_id", "=", query.account_id);
    }
    if (query.category_id) {
      querySql = querySql.where("category_id", "=", query.category_id);
    }
    if (query.start_date) {
      querySql = querySql.where(
        "transaction_created_at",
        ">=",
        new Date(query.start_date)
      );
    }
    if (query.end_date) {
      querySql = querySql.where(
        "transaction_created_at",
        "<=",
        new Date(query.end_date)
      );
    }

    const transactions = await querySql.execute();

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/transaction-create", auth, async (req, res) => {
  try {
    const schema = z.object({
      transaction_amount: z.string().min(1),
      account_id: z.string().min(1),
      category_id: z.string().min(1),
      transaction_note: z.string().optional(),
      transaction_created_at: z.string().min(1),
    });

    const body = await schema.parse(req.body);

    await db
      .insertInto("wallet_transaction")
      .values({
        transaction_id: uuid(),
        transaction_amount: body.transaction_amount,
        account_id: body.account_id,
        category_id: body.category_id,
        transaction_note: body.transaction_note,
        transaction_created_at: body.transaction_created_at,
        transaction_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "created successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/transaction-update", auth, async (req, res) => {
  try {
    const schema = z.object({
      transaction_id: z.string().min(1),
      transaction_amount: z.string().min(1).optional(),
      account_id: z.string().min(1).optional(),
      category_id: z.string().min(1).optional(),
      transaction_note: z.string().optional(),
      transaction_created_at: z.string().min(1).optional(),
    });

    const body = await schema.parse(req.body);

    await db
      .updateTable("wallet_transaction")
      .where("transaction_id", "=", body.transaction_id)
      .set({
        transaction_amount: body.transaction_amount,
        account_id: body.account_id,
        category_id: body.category_id,
        transaction_note: body.transaction_note,
        transaction_created_at: body.transaction_created_at,
        transaction_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/transaction-delete", auth, async (req, res) => {
  try {
    const schema = z.object({
      transaction_id: z.string().min(1),
    });

    const body = await schema.parse(req.body);

    await db
      .deleteFrom("wallet_transaction")
      .where("transaction_id", "=", body.transaction_id)
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default router;
