import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tpUsersTable } from "./users";

export const tpBeneficiariesTable = pgTable("tp_beneficiaries", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: integer("user_id")
    .notNull()
    .references(() => tpUsersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  bank: text("bank").notNull(),
  account: varchar("account", { length: 20 }).notNull(),
  avatarColor: varchar("avatar_color", { length: 20 }),
  initials: varchar("initials", { length: 5 }),
  favorite: boolean("favorite").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTpBeneficiarySchema = createInsertSchema(
  tpBeneficiariesTable,
).omit({ createdAt: true });

export type InsertTpBeneficiary = z.infer<typeof insertTpBeneficiarySchema>;
export type TpBeneficiary = typeof tpBeneficiariesTable.$inferSelect;
