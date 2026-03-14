import { db } from "./server/db";
import { categories, products, productVariants, productSpecs } from "./shared/schema";
import { eq } from "drizzle-orm";

async function seedNow() {
  console.log("Seeding categories...");
  const existingCats = await db.select().from(categories).limit(1);
  if (existingCats.length === 0) {
    await db.insert(categories).values([
      { slug: "iphone", name: "iPhone", icon: "Smartphone", sortOrder: 1 },
      { slug: "mac", name: "Mac", icon: "Laptop", sortOrder: 2 },
      { slug: "ipad", name: "iPad", icon: "Tablet", sortOrder: 3 },
      { slug: "watch", name: "Watch", icon: "Watch", sortOrder: 4 },
      { slug: "airpods", name: "AirPods", icon: "Headphones", sortOrder: 5 }
    ]);
    console.log("Categories seeded.");
  } else {
    console.log("Categories already exist.");
  }

  console.log("Adding variant-specific specs for MacBook Air M1...");
  const macs = await db.select().from(products).where(eq(products.slug, "macbook-air-13-m1")).limit(1);
  if (macs.length > 0) {
    const macId = macs[0].id;
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, macId));
    
    // Check if variant specs already exist
    const existingSpecs = await db.select().from(productSpecs).where(eq(productSpecs.productId, macId));
    const hasVariantSpecs = existingSpecs.some(s => s.variantId !== null);
    
    if (!hasVariantSpecs && variants.length >= 2) {
      await db.insert(productSpecs).values([
        { productId: macId, variantId: variants[0].id, specKey: "Storage Speed", specValue: "Standard SSD Speed", sortOrder: 10 },
        { productId: macId, variantId: variants[1].id, specKey: "Storage Speed", specValue: "Ultra Fast NVMe SSD", sortOrder: 10 },
      ]);
      console.log("Added dynamic variants specs for MacBook Air M1.");
    } else {
      console.log("Variant specs already exist or variants not found.");
    }
  }

  process.exit();
}

seedNow().catch(console.error);
