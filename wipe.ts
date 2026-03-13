import "dotenv/config";
import { db } from "./server/db";
import { products, productVariants, reviews, wishlist } from "./shared/schema";

async function wipe() {
  try {
    console.log("Deleting reviews...");
    await db.delete(reviews);
    console.log("Deleting wishlist...");
    await db.delete(wishlist);
    console.log("Deleting product variants...");
    await db.delete(productVariants);
    console.log("Deleting products...");
    await db.delete(products);
    console.log("Database wiped successfully. Restart the dev server to re-seed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

wipe();
