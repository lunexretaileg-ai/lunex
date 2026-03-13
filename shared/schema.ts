import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  category: text("category").notNull(),
  deviceType: text("device_type").notNull(), // 'refurbished' | 'assembled'
  releaseYear: integer("release_year"),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  storage: text("storage"),
  color: text("color"),
  conditionScore: integer("condition_score").notNull(),
  batteryHealth: integer("battery_health").notNull(),
  lunexPrice: integer("lunex_price").notNull(),
  marketPrice: integer("market_price").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(1),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertProductVariantSchema = createInsertSchema(productVariants).omit({ id: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

export type ProductWithVariants = Product & { variants: ProductVariant[] };

export type CreateProductRequest = InsertProduct;
export type CreateProductVariantRequest = InsertProductVariant;

export type ProductResponse = ProductWithVariants;
export type ProductsListResponse = ProductWithVariants[];

export interface ProductsQueryParams {
  category?: string;
  deviceType?: string;
  minCondition?: number;
  minBattery?: number;
  search?: string;
}

// ==========================================
// NEW TABLES (Auth, Admin, Orders, Wishlist)
// ==========================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  totalAmount: integer("total_amount").notNull(),
  shippingAddress: text("shipping_address").notNull(), // stored as JSON string for simplicity
  paymentMethod: text("payment_method").notNull(),
  deliveryOption: text("delivery_option").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productVariantId: integer("product_variant_id").references(() => productVariants.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  subtotal: integer("subtotal").notNull(),
});

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productVariantId: integer("product_variant_id").references(() => productVariants.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  wishlist: many(wishlist),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  productVariant: one(productVariants, { fields: [orderItems.productVariantId], references: [productVariants.id] }),
}));

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Null for guest/placeholder reviews
  productId: integer("product_id").references(() => products.id).notNull(),
  rating: integer("rating").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));
