import { pgTable, serial, integer, text, boolean, timestamp, unique, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const productVariants = pgTable("product_variants", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	storage: text(),
	color: text(),
	conditionScore: integer("condition_score").notNull(),
	batteryHealth: integer("battery_health").notNull(),
	lunexPrice: integer("lunex_price").notNull(),
	marketPrice: integer("market_price").notNull(),
	stockQuantity: integer("stock_quantity").default(1).notNull(),
	isAvailable: boolean("is_available").default(true).notNull(),
	cosmeticCondition: text("cosmetic_condition"),
});

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	category: text().notNull(),
	deviceType: text("device_type").notNull(),
	releaseYear: integer("release_year"),
	description: text().notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	icon: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const wishlist = pgTable("wishlist", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	productVariantId: integer("product_variant_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productVariantId],
			foreignColumns: [productVariants.id],
			name: "wishlist_product_variant_id_product_variants_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "wishlist_user_id_users_id_fk"
		}),
]);

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productVariantId: integer("product_variant_id").notNull(),
	quantity: integer().notNull(),
	unitPrice: integer("unit_price").notNull(),
	subtotal: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}),
	foreignKey({
			columns: [table.productVariantId],
			foreignColumns: [productVariants.id],
			name: "order_items_product_variant_id_product_variants_id_fk"
		}),
]);

export const productPhotos = pgTable("product_photos", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	variantId: integer("variant_id"),
	photoUrl: text("photo_url").notNull(),
	caption: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_photos_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "product_photos_variant_id_product_variants_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	isAdmin: boolean("is_admin").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const reviews = pgTable("reviews", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	productId: integer("product_id").notNull(),
	rating: integer().notNull(),
	reviewerName: text("reviewer_name").notNull(),
	title: text(),
	body: text().notNull(),
	isVerifiedPurchase: boolean("is_verified_purchase").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "reviews_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reviews_user_id_users_id_fk"
		}),
]);

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	status: text().default('pending').notNull(),
	totalAmount: integer("total_amount").notNull(),
	paymentMethod: text("payment_method").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	customerName: text("customer_name").notNull(),
	customerEmail: text("customer_email").notNull(),
	customerPhone: text("customer_phone").notNull(),
	governorate: text().notNull(),
	city: text().notNull(),
	address: text().notNull(),
	subtotal: integer().notNull(),
	shippingFee: integer("shipping_fee").notNull(),
	discount: integer().default(0).notNull(),
	paymentWallet: text("payment_wallet"),
	notes: text(),
	cardLastFour: text("card_last_four"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}),
]);

export const productSpecs = pgTable("product_specs", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	specKey: text("spec_key").notNull(),
	specValue: text("spec_value").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	variantId: integer("variant_id"),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_specs_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.variantId],
			foreignColumns: [productVariants.id],
			name: "product_specs_variant_id_product_variants_id_fk"
		}),
]);
