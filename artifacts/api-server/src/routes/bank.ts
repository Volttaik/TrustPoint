import { Router, type IRouter } from "express";
import { db, tpUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

const hashPin = (pin: string) =>
  crypto.createHash("sha256").update(`tp:${pin}`).digest("hex");

const genAccountNumber = () =>
  "10" + String(Math.floor(Math.random() * 100000000)).padStart(8, "0");

router.post("/bank/register", async (req, res) => {
  try {
    const { name, phone, email, pin, gender, dateOfBirth, stateOfOrigin } = req.body;

    if (!name || !phone || !pin) {
      res.status(400).json({ error: "name, phone and pin are required" });
      return;
    }

    const existing = await db
      .select()
      .from(tpUsersTable)
      .where(eq(tpUsersTable.phone, phone))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Phone number already registered" });
      return;
    }

    const [user] = await db
      .insert(tpUsersTable)
      .values({
        name,
        phone,
        email: email ?? null,
        pin: hashPin(String(pin)),
        gender: gender ?? null,
        dateOfBirth: dateOfBirth ?? null,
        stateOfOrigin: stateOfOrigin ?? null,
        accountNumber: genAccountNumber(),
        tier: "1",
        onboarded: true,
      })
      .returning();

    res.status(201).json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      accountNumber: user.accountNumber,
      tier: user.tier,
    });
  } catch (err: any) {
    req.log.error({ err }, "register error");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/bank/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      res.status(400).json({ error: "phone and pin are required" });
      return;
    }

    const [user] = await db
      .select()
      .from(tpUsersTable)
      .where(eq(tpUsersTable.phone, phone))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.pin !== hashPin(String(pin))) {
      res.status(401).json({ error: "Incorrect PIN" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      stateOfOrigin: user.stateOfOrigin,
      accountNumber: user.accountNumber,
      tier: user.tier,
      onboarded: user.onboarded,
    });
  } catch (err: any) {
    req.log.error({ err }, "login error");
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/bank/user/:phone", async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(tpUsersTable)
      .where(eq(tpUsersTable.phone, req.params.phone))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      stateOfOrigin: user.stateOfOrigin,
      accountNumber: user.accountNumber,
      tier: user.tier,
      onboarded: user.onboarded,
    });
  } catch (err: any) {
    req.log.error({ err }, "get-user error");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/bank/user/:phone", async (req, res) => {
  try {
    const { name, email, gender, dateOfBirth, stateOfOrigin, bvn } = req.body;

    const [user] = await db
      .update(tpUsersTable)
      .set({
        ...(name && { name }),
        ...(email && { email }),
        ...(gender && { gender }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(stateOfOrigin && { stateOfOrigin }),
        ...(bvn && { bvn }),
      })
      .where(eq(tpUsersTable.phone, req.params.phone))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (err: any) {
    req.log.error({ err }, "update-user error");
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
