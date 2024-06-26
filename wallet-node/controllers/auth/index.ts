import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "../../configs/db";
import jwt from "jsonwebtoken";
import auth from "../../middlewares/auth";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/auth/login", async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(6),
    });
    const body = await schema.parse(req.body);

    const user = await db
      .selectFrom("wallet_user")
      .selectAll()
      .where("wallet_user.user_name", "=", body.username)
      .executeTakeFirst();

    if (!user) {
      return res.status(404).send("User not found");
    }

    const passwordValid = await bcrypt.compare(
      body.password,
      user.user_password
    );

    if (!passwordValid) {
      return res.status(401).send("Invalid password");
    }

    const userData = {
      user_id: user.user_id,
      user_name: user.user_name,
    };

    const token = await jwt.sign(userData, process.env.SECRET_KEY || "");

    return res.status(200).json({
      token: token,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(6),
    });
    const body = await schema.parse(req.body);

    const newUser = await db
      .insertInto("wallet_user")
      .values({
        user_id: uuid(),
        user_name: body.username,
        user_password: await bcrypt.hash(body.password, 10),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const userData = {
      user_id: newUser.user_id,
      user_name: newUser.user_name,
    };

    const token = await jwt.sign(userData, process.env.SECRET_KEY || "");

    return res.status(200).json({
      token: token,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/auth/user", auth, async (req, res) => {
  try {
    return res.status(200).json({
      user_id: req.userId,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default router;
