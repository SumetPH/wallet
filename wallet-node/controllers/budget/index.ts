import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import { sql } from "kysely";
import auth from "../../middlewares/auth";
import dayjs from "dayjs";

const router = express.Router();

router.get("/budget-list", auth, async (req, res) => {
  try {
    const budget = await db
      .with("budget_all", (db) =>
        db
          .selectFrom("wallet_budget")
          .where("wallet_budget.user_id", "=", req.userId)
          .groupBy(["wallet_budget.category_id", "wallet_budget.user_id"])
          .select(({ fn }) => [
            "wallet_budget.user_id",
            "wallet_budget.category_id",
            fn.sum("wallet_budget.budget_amount").as("budget_total"),
          ])
      )
      .with("budget_spend", (db) =>
        db
          .selectFrom("transactions")
          .where("transactions.category_type_id", "=", "1")
          .where("transactions.user_id", "=", req.userId)
          .where(
            "transaction_created_at",
            ">=",
            dayjs().startOf("month").hour(0).minute(0).second(0).toDate()
          )
          .where(
            "transaction_created_at",
            "<=",
            dayjs().endOf("month").hour(23).minute(59).second(59).toDate()
          )
          .groupBy(["transactions.category_id", "transactions.user_id"])
          .select(({ fn }) => [
            "transactions.user_id",
            "transactions.category_id",
            fn.sum("transactions.transaction_amount").as("budget_spend"),
          ])
      )
      .selectFrom("budget_all")
      .leftJoin(
        "budget_spend",
        "budget_spend.category_id",
        "budget_all.category_id"
      )
      .groupBy("budget_all.user_id")
      .select(({ fn }) => [
        sql<string>`sum(budget_all.budget_total)`.as("budget_total"),
        sql<string>`sum(budget_spend.budget_spend)`.as("budget_spend"),
        sql<string>`sum(budget_all.budget_total) - sum(budget_spend.budget_spend)`.as(
          "budget_remain"
        ),
      ])
      .executeTakeFirst();

    const budgetList = await db
      .selectFrom("wallet_budget")
      .leftJoin(
        "transactions",
        "transactions.category_id",
        "wallet_budget.category_id"
      )
      .where("transactions.category_type_id", "=", "1")
      .where(
        "transaction_created_at",
        ">=",
        dayjs().startOf("month").hour(0).minute(0).second(0).toDate()
      )
      .where(
        "transaction_created_at",
        "<=",
        dayjs().endOf("month").hour(23).minute(59).second(59).toDate()
      )
      .groupBy("wallet_budget.budget_id")
      .orderBy("wallet_budget.budget_name")
      .select(({ fn }) => [
        "wallet_budget.budget_id",
        "wallet_budget.budget_name",
        "wallet_budget.budget_amount",
        fn.sum("transactions.transaction_amount").as("expense"),
        sql<string>`wallet_budget.budget_amount - sum(transactions.transaction_amount)`.as(
          "remain"
        ),
        "wallet_budget.category_id",
      ])
      .execute();

    return res.json({
      budget,
      budgetList,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/budget-create", auth, async (req, res) => {
  try {
    const schema = z.object({
      budget_name: z.string().min(1),
      budget_amount: z.string().min(1),
      budget_created_at: z.string().min(1),
      category_id: z.string().min(1),
    });

    const body = await schema.parse(req.body);

    await db
      .insertInto("wallet_budget")
      .values({
        budget_id: uuid(),
        budget_amount: body.budget_amount,
        budget_name: body.budget_name,
        budget_created_at: body.budget_created_at,
        category_id: body.category_id,
        user_id: req.userId,
        budget_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

router.put("/budget-update", auth, async (req, res) => {
  try {
    const schema = z.object({
      budget_id: z.string().min(1),
      budget_name: z.string().min(1).optional(),
      budget_amount: z.string().min(1).optional(),
      budget_created_at: z.string().min(1).optional(),
      category_id: z.string().min(1).optional(),
    });

    const body = await schema.parse(req.body);

    await db
      .updateTable("wallet_budget")
      .where("wallet_budget.budget_id", "=", body.budget_id)
      .set({
        budget_amount: body.budget_amount,
        budget_name: body.budget_name,
        budget_created_at: body.budget_created_at,
        budget_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        category_id: body.category_id,
      })
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

router.delete("/budget-delete", auth, async (req, res) => {
  try {
    const schema = z.object({
      budget_id: z.string().min(1),
    });

    const body = await schema.parse(req.body);

    await db
      .deleteFrom("wallet_budget")
      .where("wallet_budget.budget_id", "=", body.budget_id)
      .executeTakeFirstOrThrow();

    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

export default router;
