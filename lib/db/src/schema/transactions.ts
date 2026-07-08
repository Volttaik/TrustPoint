import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tpUsersTable } from "./users";

export const transactionTypeEnum = pgEnum("tp_transaction_type", [
  "credit",
  "debit",
]);

export const transactionStatusEnum = pgEnum("tp_transaction_status", [
  "success",
  "pending",
  "failed",
]);

export const tpTransactionsTable = pgTable("tp_transactions", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: integer("user_id")
    .notNull()
    .references(() => tpUsersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").notNull().default("success"),
  category: varchar("category", { length: 50 }).notNull(),
  reference: varchar("reference", { length: 50 }).unique(),
  bank: text("bank"),
  avatarColor: varchar("avatar_color", { length: 20 }),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTpTransactionSchema = createInsertSchema(
  tpTransactionsTable,
).omit({ createdAt: true });

export type InsertTpTransaction = z.infer<typeof insertTpTransactionSchema>;
export type TpTransaction = typeof tpTransactionsTable.$inferSelect;
