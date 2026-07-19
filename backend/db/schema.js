import {
  mysqlTable,
  int,
  text,
  varchar,
  decimal,
  timestamp,
  boolean,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["farmer", "buyer", "admin"]).notNull().default("buyer"),
  location: varchar("location", { length: 150 }),
  avatarInitials: varchar("avatar_initials", { length: 3 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  description: text("description"),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  farmerId: int("farmer_id")
    .notNull()
    .references(() => users.id),
  categoryId: int("category_id")
    .notNull()
    .references(() => categories.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 30 }).notNull(),
  quantityAvailable: decimal("quantity_available", {
    precision: 10,
    scale: 2,
  }).notNull(),
  location: varchar("location", { length: 150 }),
  imageUrl: text("image_url"),
  status: mysqlEnum("status", ["active", "sold", "expired"])
    .notNull()
    .default("active"),
  organic: boolean("organic").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketPrices = mysqlTable("market_prices", {
  id: int("id").autoincrement().primaryKey(),
  productName: varchar("product_name", { length: 100 }).notNull(),
  categoryId: int("category_id").references(() => categories.id),
  minPrice: decimal("min_price", { precision: 10, scale: 2 }).notNull(),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }).notNull(),
  avgPrice: decimal("avg_price", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 30 }).notNull(),
  region: varchar("region", { length: 100 }),
  trend: varchar("trend", { length: 10 }).default("stable"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyer_id")
    .notNull()
    .references(() => users.id),
  productId: int("product_id")
    .notNull()
    .references(() => products.id),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "delivered", "cancelled"])
    .notNull()
    .default("pending"),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyer_id")
    .notNull()
    .references(() => users.id),
  farmerId: int("farmer_id")
    .notNull()
    .references(() => users.id),
  productId: int("product_id").references(() => products.id),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
