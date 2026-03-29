import { relations } from "drizzle-orm/relations";
import { productVariants, wishlist, users, orders, orderItems, products, productPhotos, reviews, productSpecs } from "./schema";

export const wishlistRelations = relations(wishlist, ({one}) => ({
	productVariant: one(productVariants, {
		fields: [wishlist.productVariantId],
		references: [productVariants.id]
	}),
	user: one(users, {
		fields: [wishlist.userId],
		references: [users.id]
	}),
}));

export const productVariantsRelations = relations(productVariants, ({many}) => ({
	wishlists: many(wishlist),
	orderItems: many(orderItems),
	productPhotos: many(productPhotos),
	productSpecs: many(productSpecs),
}));

export const usersRelations = relations(users, ({many}) => ({
	wishlists: many(wishlist),
	reviews: many(reviews),
	orders: many(orders),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	productVariant: one(productVariants, {
		fields: [orderItems.productVariantId],
		references: [productVariants.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	orderItems: many(orderItems),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
}));

export const productPhotosRelations = relations(productPhotos, ({one}) => ({
	product: one(products, {
		fields: [productPhotos.productId],
		references: [products.id]
	}),
	productVariant: one(productVariants, {
		fields: [productPhotos.variantId],
		references: [productVariants.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	productPhotos: many(productPhotos),
	reviews: many(reviews),
	productSpecs: many(productSpecs),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));

export const productSpecsRelations = relations(productSpecs, ({one}) => ({
	product: one(products, {
		fields: [productSpecs.productId],
		references: [products.id]
	}),
	productVariant: one(productVariants, {
		fields: [productSpecs.variantId],
		references: [productVariants.id]
	}),
}));