import { db } from "./db";
import { products, productVariants, productSpecs, type ProductsQueryParams, type ProductWithVariants } from "@shared/schema";
import { eq, ilike, and, gte, desc } from "drizzle-orm";

export interface IStorage {
  getProducts(params?: ProductsQueryParams): Promise<ProductWithVariants[]>;
  getProductBySlug(slug: string): Promise<ProductWithVariants | undefined>;
  createProduct(data: any): Promise<ProductWithVariants>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(params?: ProductsQueryParams): Promise<ProductWithVariants[]> {
    let conditions = [];
    
    if (params?.category) {
      conditions.push(eq(products.category, params.category));
    }
    
    if (params?.deviceType) {
      conditions.push(eq(products.deviceType, params.deviceType));
    }
    
    if (params?.search) {
      conditions.push(ilike(products.name, `%${params.search}%`));
    }

    const allProducts = await db.query.products.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        variants: true,
        specs: { orderBy: (s: any, { asc }: any) => [asc(s.sortOrder)] }
      },
      orderBy: [desc(products.createdAt)]
    });

    // Filter by variant conditions (minCondition, minBattery)
    let filteredProducts = allProducts;
    
    if (params?.minCondition || params?.minBattery) {
      filteredProducts = allProducts.filter(product => {
        return product.variants.some(variant => {
          let matchesCondition = true;
          let matchesBattery = true;
          
          if (params.minCondition && variant.conditionScore < params.minCondition) {
            matchesCondition = false;
          }
          if (params.minBattery && variant.batteryHealth < params.minBattery) {
            matchesBattery = false;
          }
          
          return matchesCondition && matchesBattery;
        });
      });
    }

    return filteredProducts;
  }

  async getProductBySlug(slug: string): Promise<ProductWithVariants | undefined> {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        variants: true,
        specs: { orderBy: (s: any, { asc }: any) => [asc(s.sortOrder)] }
      }
    });
    
    return product;
  }

  async createProduct(data: any): Promise<ProductWithVariants> {
    // Stub implementation for Admin dashboard demo
    return data as any;
  }
}

export const storage = new DatabaseStorage();
