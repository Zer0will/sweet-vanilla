import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Customer orders submitted through the guided order flow.
 * `deliveryDate` is stored as YYYY-MM-DD (delivery day, weekend only).
 * Capacity rule: max 5 orders per deliveryDate (pending + confirmed count).
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  productType: mysqlEnum("productType", ["pastel", "docena", "churros"]).notNull(),
  item: varchar("item", { length: 191 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  flavor: varchar("flavor", { length: 191 }),
  filling: varchar("filling", { length: 191 }),
  decoration: text("decoration"),
  occasion: varchar("occasion", { length: 191 }),
  deliveryDate: varchar("deliveryDate", { length: 10 }).notNull(),
  customerName: varchar("customerName", { length: 191 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 32 }).notNull(),
  notes: text("notes"),
  photoUrls: text("photoUrls"), // JSON array of public S3 URLs
  estimatedTotal: int("estimatedTotal").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
