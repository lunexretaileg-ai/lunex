import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Device type values: 'new' | 'open_box' | 'refurbished' | 'assembled' | 'used'
export const DEVICE_TYPES = ['new', 'open_box', 'refurbished', 'assembled', 'used'] as const;
export type DeviceType = typeof DEVICE_TYPES[number];

// ==========================================
// Categories table
// ==========================================
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),  // e.g. 'iphone', 'mac', 'ipad', 'watch', 'airpods'
  name: text("name").notNull(),           // e.g. 'iPhone', 'Mac', 'iPad'
  icon: text("icon"),                     // optional emoji or icon name
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  category: text("category").notNull(),
  deviceType: text("device_type").notNull(), // 'new' | 'open_box' | 'refurbished' | 'assembled' | 'used'
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
  cosmeticCondition: text("cosmetic_condition"), // e.g. "Minor scratches on back panel"
  lunexPrice: integer("lunex_price").notNull(),
  marketPrice: integer("market_price").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(1),
  isAvailable: boolean("is_available").notNull().default(true),
});

// Product specifications table — can be per-product (shared) OR per-variant (storage-specific)
export const productSpecs = pgTable("product_specs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  // If variantId is set, this spec applies only to that variant (e.g. different storage options)
  // If null, the spec applies to all variants (shared product-level specs)
  variantId: integer("variant_id").references(() => productVariants.id),
  specKey: text("spec_key").notNull(),    // e.g. "Chip", "Display", "Storage"
  specValue: text("spec_value").notNull(), // e.g. "A17 Pro", "6.7-inch OLED", "256GB NVMe"
  sortOrder: integer("sort_order").notNull().default(0),
});

// ==========================================
// Real Product Photos table
// ==========================================
// Each row is one photo URL for a specific product.
// These are real images of actual devices taken before shipping — not stock photos.
export const productPhotos = pgTable("product_photos", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  // Optional: tie a specific photo to a specific variant (e.g. different color angle shots)
  variantId: integer("variant_id").references(() => productVariants.id),
  photoUrl: text("photo_url").notNull(),          // The full URL of the hosted image
  caption: text("caption"),                        // Optional short caption (e.g. "Front view", "Screen condition", "Back panel")
  sortOrder: integer("sort_order").notNull().default(0),  // Controls display order in the gallery
});

export const insertProductPhotoSchema = createInsertSchema(productPhotos).omit({ id: true });
export type ProductPhoto = typeof productPhotos.$inferSelect;
export type InsertProductPhoto = z.infer<typeof insertProductPhotoSchema>;

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  specs: many(productSpecs),
  photos: many(productPhotos),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const productSpecsRelations = relations(productSpecs, ({ one }) => ({
  product: one(products, {
    fields: [productSpecs.productId],
    references: [products.id],
  }),
}));

export const productPhotosRelations = relations(productPhotos, ({ one }) => ({
  product: one(products, {
    fields: [productPhotos.productId],
    references: [products.id],
  }),
}));

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertProductVariantSchema = createInsertSchema(productVariants).omit({ id: true });
export const insertProductSpecSchema = createInsertSchema(productSpecs).omit({ id: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

export type ProductSpec = typeof productSpecs.$inferSelect;
export type InsertProductSpec = z.infer<typeof insertProductSpecSchema>;

export type ProductWithVariants = Product & { variants: ProductVariant[]; specs?: ProductSpec[] };

export type CreateProductRequest = InsertProduct;
export type CreateProductVariantRequest = InsertProductVariant;

export type ProductResponse = ProductWithVariants;
export type ProductsListResponse = ProductWithVariants[];

export interface ProductsQueryParams {
  category?: string;
  /** One of: new | open_box | refurbished | assembled | used */
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
  
  // Storing these directly so guest checkout works perfectly
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  
  // Shipping details split out
  governorate: text("governorate").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  notes: text("notes"), // Optional delivery notes
  
  // Order financials
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").notNull(),
  discount: integer("discount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  
  paymentMethod: text("payment_method").notNull(), 
  paymentWallet: text("payment_wallet"), // if applicable (Vodafone, Orange, etc)
  cardLastFour: text("card_last_four"), // last 4 digits only — never store full card
  
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

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

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
