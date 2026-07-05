import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tpUsersTable = pgTable("tp_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  email: text("email"),
  pin: varchar("pin", { length: 64 }).notNull(),
  bvn: varchar("bvn", { length: 11 }),
  gender: varchar("gender", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  stateOfOrigin: text("state_of_origin"),
  accountNumber: varchar("account_number", { length: 10 }).unique(),
  tier: varchar("tier", { length: 5 }).default("1"),
  onboarded: boolean("onboarded").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTpUserSchema = createInsertSchema(tpUsersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTpUser = z.infer<typeof insertTpUserSchema>;
export type TpUser = typeof tpUsersTable.$inferSelect;
