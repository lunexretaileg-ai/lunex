import { db } from "../server/db";
import { 
  categories, products, productVariants, productSpecs, 
  productPhotos, reviews 
} from "../shared/schema";
import fs from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";

async function importDataset() {
  try {
    console.log("Reading dataset.json...");
    const datasetPath = path.resolve(process.cwd(), "plan", "dataset.json");
    const data = JSON.parse(await fs.readFile(datasetPath, "utf-8"));

    console.log("Cleaning existing data...");
    // Order matters because of FKs
    await db.delete(reviews);
    await db.delete(productPhotos);
    await db.delete(productSpecs);
    await db.delete(productVariants);
    await db.delete(products);
    await db.delete(categories);

    console.log("Inserting categories...");
    const categorySlugs = [...new Set(data.products.map((p: any) => p.category))];
    const catInsert = categorySlugs.map((slug: any, index) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      sortOrder: index + 1,
      icon: "Smartphone" // Default icon
    }));
    await db.insert(categories).values(catInsert);

    for (const p of data.products) {
      console.log(`Importing product: ${p.name}`);
      
      // 1. Insert Product
      const [insertedProduct] = await db.insert(products).values({
        name: p.name,
        slug: p.slug,
        category: p.category,
        deviceType: p.device_type,
        releaseYear: p.release_year,
        description: p.description,
        imageUrl: p.image_url,
      }).returning();

      // 2. Insert Variants
      for (const v of p.variants) {
        const [insertedVariant] = await db.insert(productVariants).values({
          productId: insertedProduct.id,
          storage: v.storage,
          color: v.color,
          conditionScore: v.condition_score,
          batteryHealth: v.battery_health,
          cosmeticCondition: v.cosmetic_condition,
          lunexPrice: v.lunex_price,
          marketPrice: v.market_price,
          stockQuantity: v.stock_quantity,
          isAvailable: v.is_available,
        }).returning();

        // Check if there are specific specs for this variant (not in JSON structure but good to have)
      }

      // 3. Insert Product-level Specs
      const specsToInsert = Object.entries(p.specs)
        .filter(([key]) => key !== 'storage_options' && key !== 'available_colors')
        .map(([key, value], index) => ({
          productId: insertedProduct.id,
          specKey: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          specValue: String(value),
          sortOrder: index,
        }));
      
      if (specsToInsert.length > 0) {
        await db.insert(productSpecs).values(specsToInsert);
      }

      // 4. Insert Photos
      if (p.product_photos && p.product_photos.length > 0) {
        const photosToInsert = p.product_photos.map((ph: any) => ({
          productId: insertedProduct.id,
          photoUrl: ph.url,
          caption: ph.caption,
          sortOrder: ph.sort_order,
        }));
        await db.insert(productPhotos).values(photosToInsert);
      }

      // 5. Insert Reviews
      if (p.reviews && p.reviews.length > 0) {
        const reviewsToInsert = p.reviews.map((rev: any) => ({
          productId: insertedProduct.id,
          rating: rev.rating,
          reviewerName: rev.user_name,
          title: rev.title,
          body: rev.body,
          isVerifiedPurchase: rev.is_verified_purchase,
          // userId is null for now as it's a seed
        }));
        await db.insert(reviews).values(reviewsToInsert);
      }
    }

    console.log("Import completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

importDataset();
