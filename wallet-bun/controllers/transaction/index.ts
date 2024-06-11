import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import { sql } from "kysely";

const router = express.Router();

router.get("/transaction-list", async (req, res) => {
  try {
    const schema = z.object({
      account_id: z.string().min(1),
    });

    const query = await schema.parse({
      account_id: req.query.account_id,
    });

    const transactions = await db
      .selectFrom("transactions")
      .select([
        sql<string>`to_char(date(transaction_created_at), 'YYYY-MM-DD')`.as(
          "date"
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
              'category_id', category_id,
              'category_name', category_name,
              'category_type_id', category_type_id,
              'category_type_name', category_type_name,
              'transaction_created_at', to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS')
          ) order by transaction_created_at desc
        )
      `.as("transactions"),
      ])
      .where("account_id", "=", query.account_id)
      .groupBy([sql`date(transaction_created_at)`])
      .orderBy("date desc")
      .execute();

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/transaction-create", async (req, res) => {
  try {
    const schema = z.object({
      transaction_amount: z.string().min(1),
      account_id: z.string().min(1),
      category_id: z.string().min(1),
      transaction_note: z.string().min(1),
      transaction_created_at: z.string().datetime(),
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
        transaction_updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "created successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/transaction-update", async (req, res) => {
  try {
    const schema = z.object({
      transaction_id: z.string().min(1),
      transaction_amount: z.string().min(1),
      account_id: z.string().min(1),
      category_id: z.string().min(1),
      transaction_note: z.string().min(1),
      transaction_created_at: z.string().datetime(),
    });

    const body = await schema.parse(req.body);

    await db
      .updateTable("wallet_transaction")
      .where("transaction_id", "=", body.transaction_id)
      .set({
        transaction_id: body.transaction_id,
        transaction_amount: body.transaction_amount,
        account_id: body.account_id,
        category_id: body.category_id,
        transaction_note: body.transaction_note,
        transaction_created_at: body.transaction_created_at,
        transaction_updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/transaction-delete", async (req, res) => {
  try {
    const schema = z.object({
      transaction_id: z.string().min(1),
    });

    const body = await schema.parse(req.body);

    await db
      .deleteFrom("wallet_transaction")
      .where("transaction_id", "=", body.transaction_id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default router;