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

export const cardTypeEnum = pgEnum("tp_card_type", ["virtual", "physical"]);

export const tpCardsTable = pgTable("tp_cards", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: integer("user_id")
    .notNull()
    .references(() => tpUsersTable.id, { onDelete: "cascade" }),
  type: cardTypeEnum("type").notNull().default("virtual"),
  number: varchar("number", { length: 19 }).notNull(), // masked/encrypted
  holder: text("holder").notNull(),
  expiry: varchar("expiry", { length: 7 }).notNull(), // MM/YYYY
  cvv: varchar("cvv", { length: 64 }).notNull(), // hashed
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  frozen: boolean("frozen").notNull().default(false),
  currency: varchar("currency", { length: 5 }).notNull().default("NGN"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTpCardSchema = createInsertSchema(tpCardsTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertTpCard = z.infer<typeof insertTpCardSchema>;
export type TpCard = typeof tpCardsTable.$inferSelect;
