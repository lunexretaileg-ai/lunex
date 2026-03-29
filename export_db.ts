import 'dotenv/config';
import fs from 'fs';
import { db } from './server/db';
import * as schema from './shared/schema';

async function exportDb() {
  const data: any = {};
  
  try {
    console.log("Exporting categories...");
    data.categories = await db.select().from(schema.categories);
    
    console.log("Exporting products...");
    data.products = await db.select().from(schema.products);
    
    console.log("Exporting variants...");
    data.productVariants = await db.select().from(schema.productVariants);
    
    console.log("Exporting specs...");
    data.productSpecs = await db.select().from(schema.productSpecs);
    
    console.log("Exporting photos...");
    data.productPhotos = await db.select().from(schema.productPhotos);
    
    console.log("Exporting users...");
    data.users = await db.select().from(schema.users);
    
    console.log("Exporting orders...");
    data.orders = await db.select().from(schema.orders);
    
    console.log("Exporting order items...");
    data.orderItems = await db.select().from(schema.orderItems);

    console.log("Exporting wishlist...");
    data.wishlist = await db.select().from(schema.wishlist);
    
    fs.writeFileSync('database_data.json', JSON.stringify(data, null, 2));
    
    const schemaContent = fs.readFileSync('shared/schema.ts', 'utf-8');
    fs.writeFileSync('database_schema.ts', schemaContent);
    
    console.log("Successfully exported to database_data.json and database_schema.ts");
    process.exit(0);
  } catch (error) {
    console.error("Export failed:", error);
    process.exit(1);
  }
}

exportDb();
