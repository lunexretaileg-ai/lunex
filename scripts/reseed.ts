/**
 * Lunex Full Reseed Script
 * - Wipes all reviews, product_photos, product_specs, product_variants, products
 * - Re-inserts all 30 products from plan/dataset.json
 * Run: npx tsx --env-file=.env scripts/reseed.ts
 */
import { db } from "../server/db";
import {
  reviews, productPhotos, productSpecs, productVariants, products, orders, orderItems, wishlist
} from "../shared/schema";
import datasetRaw from "../plan/dataset.json";
import { sql } from "drizzle-orm";

const dataset = datasetRaw as any;

async function reseed() {
  console.log("🗑️  Wiping old data...");

  // Delete in dependency order to avoid foreign key violations
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(wishlist);
  await db.delete(reviews);
  await db.delete(productPhotos);
  await db.delete(productSpecs);
  await db.delete(productVariants);
  await db.delete(products);

  // Reset auto-increment sequences
  await db.execute(sql`ALTER SEQUENCE order_items_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE orders_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE reviews_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE product_photos_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE product_specs_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE product_variants_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE products_id_seq RESTART WITH 1`);

  console.log("✅ Old data wiped. Inserting new dataset...\n");

  for (const p of dataset.products) {
    // 1. Insert product
    const [insertedProduct] = await db.insert(products).values({
      name: p.name,
      slug: p.slug,
      category: p.category,
      deviceType: p.device_type,
      releaseYear: p.release_year ?? null,
      description: p.description,
      imageUrl: p.image_url,
    }).returning();

    const productId = insertedProduct.id;
    console.log(`📦 Inserted product: ${p.name} → id=${productId}`);

    // 2. Insert specs (global, no variantId)
    if (p.specs && typeof p.specs === "object") {
      const specEntries = Object.entries(p.specs);
      const specsToInsert = specEntries
        .filter(([key]) => key !== "storage_options" && key !== "available_colors" && key !== "available_sizes")
        .map(([key, value], idx) => ({
          productId,
          variantId: null,
          specKey: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase()),
          specValue: Array.isArray(value) ? (value as any[]).join(", ") : String(value),
          sortOrder: idx,
        }));
      if (specsToInsert.length > 0) {
        await db.insert(productSpecs).values(specsToInsert);
      }
    }

    // 3. Insert variants
    const variantIdMap: Record<string, number> = {};
    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        const [insertedVariant] = await db.insert(productVariants).values({
          productId,
          storage: v.storage ?? null,
          color: v.color ?? null,
          conditionScore: v.condition_score,
          batteryHealth: v.battery_health,
          cosmeticCondition: v.cosmetic_condition ?? null,
          lunexPrice: v.lunex_price,
          marketPrice: v.market_price,
          stockQuantity: v.stock_quantity,
          isAvailable: v.is_available,
        }).returning();
        variantIdMap[v.variant_id] = insertedVariant.id;
      }
    }

    // 4. Insert product photos
    if (p.product_photos && p.product_photos.length > 0) {
      await db.insert(productPhotos).values(
        p.product_photos.map((ph: any) => ({
          productId,
          variantId: null,
          photoUrl: ph.url,
          caption: ph.caption ?? null,
          sortOrder: ph.sort_order ?? 0,
        }))
      );
    }

    // 5. Insert reviews
    if (p.reviews && p.reviews.length > 0) {
      for (const r of p.reviews) {
        await db.insert(reviews).values({
          productId,
          userId: null,
          rating: r.rating,
          reviewerName: r.user_name,
          title: r.title,
          body: r.body,
          isVerifiedPurchase: r.is_verified_purchase,
        });
      }
    }
  }

  console.log("\n🎉 Reseed complete! All 30 products inserted successfully.");
  process.exit(0);
}

reseed().catch(err => {
  console.error("❌ Reseed failed:", err);
  process.exit(1);
});
