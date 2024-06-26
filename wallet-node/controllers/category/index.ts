import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import { sql } from "kysely";
import auth from "../../middlewares/auth";
import dayjs from "dayjs";

const router = express.Router();

router.get("/category-list", auth, async (req, res) => {
  try {
    const schema = z.object({
      category_type_id: z.string().min(1),
    });

    const query = await schema.parse({
      category_type_id: req.query.category_type_id,
    });

    const category = await db
      .selectFrom("wallet_category")
      .where("wallet_category.user_id", "=", req.userId)
      .where("wallet_category.category_type_id", "=", query.category_type_id)
      .selectAll()
      .execute();

    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export default router;
