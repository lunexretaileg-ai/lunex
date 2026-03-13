import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { products, productVariants, wishlist, orders, orderItems } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.products.list.path, async (req, res) => {
    try {
      const params = api.products.list.input?.parse(req.query);
      const items = await storage.getProducts(params);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Product Reviews API
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const { reviews } = await import("@shared/schema");
      const productReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, parseInt(req.params.id)))
        .orderBy(reviews.createdAt);
      res.json(productReviews);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Wishlist API
  app.get("/api/wishlist", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
      const items = await db
        .select()
        .from(wishlist)
        .where(eq(wishlist.userId, parseInt(userId as string)));
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { productVariantId } = req.body;
    if (!productVariantId) return res.status(400).json({ message: "Missing productVariantId" });

    try {
      const [item] = await db
        .insert(wishlist)
        .values({
          userId: parseInt(userId as string),
          productVariantId: parseInt(productVariantId),
        })
        .returning();
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
      await db
        .delete(wishlist)
        .where(
          and(
            eq(wishlist.id, parseInt(req.params.id)),
            eq(wishlist.userId, parseInt(userId as string))
          )
        );
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });
  // Orders endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      // In a production app, we would validate orderData with Zod schema here
      // For now, assume it exactly matches InsertOrder type + an items array

      const result = await db.transaction(async (tx) => {
        // 1. Insert Order
        const [newOrder] = await tx
          .insert(orders)
          .values({
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            governorate: orderData.governorate,
            city: orderData.city,
            address: orderData.address,
            subtotal: orderData.subtotal,
            shippingFee: orderData.shippingFee,
            discount: orderData.discount,
            totalAmount: orderData.totalAmount,
            paymentMethod: orderData.paymentMethod,
            paymentWallet: orderData.paymentWallet,
            status: "pending",
          })
          .returning();

        // 2. Insert Order Items
        if (orderData.items && orderData.items.length > 0) {
          const itemsToInsert = orderData.items.map((item: any) => ({
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          }));
          await tx.insert(orderItems).values(itemsToInsert);
          
          // Optional: Decrement stock here in a real app
        }

        return newOrder;
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Failed to create order", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Admin API - Orders
  app.get("/api/admin/orders", async (req, res) => {
    // In a production app, we would verify the user is actually an admin via session/token
    try {
      // Use Drizzle Relational Queries for deep fetching
      const allOrders = await db.query.orders.findMany({
        with: {
          items: {
            with: {
              productVariant: {
                with: {
                  product: true
                }
              }
            }
          }
        },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      });
      res.json(allOrders);
    } catch (error) {
      console.error("Failed to fetch admin orders", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Admin API - Products
  app.post("/api/admin/products", async (req, res) => {
    // Authorization check omitted for brevity in demo
    try {
      const newProduct = await storage.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
       res.status(500).json({ message: "Failed to create product" });
    }
  });
  // Seed data function to insert some sample data on startup
  await seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length === 0) {
    console.log("Seeding database with initial Apple devices and reviews...");
    
    // Seed iPhone 15 Pro
    const [iphone] = await db.insert(products).values({
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      category: "iphone",
      deviceType: "refurbished",
      releaseYear: 2023,
      description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.",
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000",
    }).returning();
    
    await db.insert(productVariants).values([
      {
        productId: iphone.id,
        storage: "256GB",
        color: "Natural Titanium",
        conditionScore: 9,
        batteryHealth: 98,
        lunexPrice: 42000,
        marketPrice: 52000,
        stockQuantity: 5,
        isAvailable: true
      },
      {
        productId: iphone.id,
        storage: "128GB",
        color: "Blue Titanium",
        conditionScore: 8,
        batteryHealth: 88,
        lunexPrice: 38000,
        marketPrice: 48000,
        stockQuantity: 3,
        isAvailable: true
      }
    ]);

    // Seed iPhone 14 Pro Max
    const [iphone14] = await db.insert(products).values({
      name: "iPhone 14 Pro Max",
      slug: "iphone-14-pro-max",
      category: "iphone",
      deviceType: "refurbished",
      releaseYear: 2022,
      description: "ProMotion display, A16 Bionic chip, and an advanced camera system — at a Lunex price up to 40% below Egypt market.",
      imageUrl: "https://images.unsplash.com/photo-1664472896721-ec8e36c46f17?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: iphone14.id,
        storage: "256GB",
        color: "Deep Purple",
        conditionScore: 9,
        batteryHealth: 95,
        lunexPrice: 36000,
        marketPrice: 48000,
        stockQuantity: 4,
        isAvailable: true,
      },
      {
        productId: iphone14.id,
        storage: "128GB",
        color: "Space Black",
        conditionScore: 8,
        batteryHealth: 90,
        lunexPrice: 33000,
        marketPrice: 44000,
        stockQuantity: 5,
        isAvailable: true,
      },
    ]);

    // Seed iPhone 13
    const [iphone13] = await db.insert(products).values({
      name: "iPhone 13",
      slug: "iphone-13",
      category: "iphone",
      deviceType: "refurbished",
      releaseYear: 2021,
      description: "The perfect balance of performance and value with A15 Bionic and excellent battery life.",
      imageUrl: "https://images.unsplash.com/photo-1636054803552-6a1e6c01f4e9?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: iphone13.id,
        storage: "128GB",
        color: "Midnight",
        conditionScore: 8,
        batteryHealth: 92,
        lunexPrice: 23000,
        marketPrice: 32000,
        stockQuantity: 7,
        isAvailable: true,
      },
      {
        productId: iphone13.id,
        storage: "256GB",
        color: "Starlight",
        conditionScore: 7,
        batteryHealth: 88,
        lunexPrice: 25000,
        marketPrice: 35000,
        stockQuantity: 3,
        isAvailable: true,
      },
    ]);

    // Seed iPhone SE (3rd gen)
    const [iphoneSe] = await db.insert(products).values({
      name: "iPhone SE (3rd Gen)",
      slug: "iphone-se-3",
      category: "iphone",
      deviceType: "assembled",
      releaseYear: 2022,
      description: "Compact, powerful, and budget‑friendly entry into the Apple ecosystem.",
      imageUrl: "https://images.unsplash.com/photo-1581014023865-376269646c98?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: iphoneSe.id,
        storage: "64GB",
        color: "Product Red",
        conditionScore: 8,
        batteryHealth: 94,
        lunexPrice: 14500,
        marketPrice: 21000,
        stockQuantity: 6,
        isAvailable: true,
      },
    ]);

    // Seed MacBook Pro 14"
    const [macbook] = await db.insert(products).values({
      name: "MacBook Pro 14\"",
      slug: "macbook-pro-14-m3",
      category: "mac",
      deviceType: "refurbished",
      releaseYear: 2023,
      description: "Mind-blowing performance with the M3 chip. Brilliant Liquid Retina XDR display. Up to 22 hours of battery life.",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: macbook.id,
        storage: "512GB",
        color: "Space Black",
        conditionScore: 10,
        batteryHealth: 100,
        lunexPrice: 75000,
        marketPrice: 95000,
        stockQuantity: 2,
        isAvailable: true
      }
    ]);

    // Seed MacBook Air M1
    const [macbookAir] = await db.insert(products).values({
      name: "MacBook Air 13\" M1",
      slug: "macbook-air-13-m1",
      category: "mac",
      deviceType: "refurbished",
      releaseYear: 2020,
      description: "Iconic thin-and-light MacBook Air with the M1 chip and all‑day battery life.",
      imageUrl: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: macbookAir.id,
        storage: "256GB",
        color: "Space Gray",
        conditionScore: 9,
        batteryHealth: 97,
        lunexPrice: 32000,
        marketPrice: 43000,
        stockQuantity: 5,
        isAvailable: true,
      },
      {
        productId: macbookAir.id,
        storage: "512GB",
        color: "Silver",
        conditionScore: 8,
        batteryHealth: 93,
        lunexPrice: 35500,
        marketPrice: 47000,
        stockQuantity: 2,
        isAvailable: true,
      },
    ]);

    // Seed iPad Air
    const [ipadAir] = await db.insert(products).values({
      name: "iPad Air (5th Gen)",
      slug: "ipad-air-5",
      category: "ipad",
      deviceType: "refurbished",
      releaseYear: 2022,
      description: "All‑screen design with M1 power, perfect for students and creatives.",
      imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: ipadAir.id,
        storage: "64GB",
        color: "Blue",
        conditionScore: 9,
        batteryHealth: 96,
        lunexPrice: 21000,
        marketPrice: 29000,
        stockQuantity: 4,
        isAvailable: true,
      },
      {
        productId: ipadAir.id,
        storage: "256GB",
        color: "Space Gray",
        conditionScore: 8,
        batteryHealth: 92,
        lunexPrice: 25500,
        marketPrice: 34000,
        stockQuantity: 3,
        isAvailable: true,
      },
    ]);

    // Seed Apple Watch Series 9
    const [watch] = await db.insert(products).values({
      name: "Apple Watch Series 9",
      slug: "apple-watch-series-9",
      category: "watch",
      deviceType: "refurbished",
      releaseYear: 2023,
      description: "Advanced health features, always‑on display, and all‑day battery — tailored for your daily routine.",
      imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: watch.id,
        storage: null,
        color: "Midnight",
        conditionScore: 9,
        batteryHealth: 98,
        lunexPrice: 15500,
        marketPrice: 22000,
        stockQuantity: 6,
        isAvailable: true,
      },
    ]);

    // Seed AirPods Pro
    const [airpods] = await db.insert(products).values({
      name: "AirPods Pro (2nd Gen)",
      slug: "airpods-pro-2",
      category: "airpods",
      deviceType: "assembled",
      releaseYear: 2022,
      description: "Rich, high-quality audio and voice. Next-level Active Noise Cancellation and Adaptive Transparency.",
      imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: airpods.id,
        storage: null,
        color: "White",
        conditionScore: 10,
        batteryHealth: 100,
        lunexPrice: 7500,
        marketPrice: 11500,
        stockQuantity: 15,
        isAvailable: true
      }
    ]);

    // Seed AirPods Max
    const [airpodsMax] = await db.insert(products).values({
      name: "AirPods Max",
      slug: "airpods-max",
      category: "airpods",
      deviceType: "refurbished",
      releaseYear: 2020,
      description: "High‑fidelity over‑ear headphones with Active Noise Cancellation and spatial audio.",
      imageUrl: "https://images.unsplash.com/photo-1603357465999-241beecc2626?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: airpodsMax.id,
        storage: null,
        color: "Sky Blue",
        conditionScore: 9,
        batteryHealth: 100,
        lunexPrice: 24500,
        marketPrice: 34000,
        stockQuantity: 3,
        isAvailable: true,
      },
    ]);

    // Seed Chinese Assembled Device
    const [chineseIphone] = await db.insert(products).values({
      name: "iPhone 15 Pro Max (تجميع صيني 100%)",
      slug: "iphone-15-pro-max-assembled-cn",
      category: "iphone",
      deviceType: "assembled",
      releaseYear: 2023,
      description: "جهاز تجميع مصنع صيني دقيق جداً بجميع القطع الأصلية عدا الشاشة، أداء مطابق للأصلي بتكلفة أقل بكتير.",
      imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000",
    }).returning();

    await db.insert(productVariants).values([
      {
        productId: chineseIphone.id,
        storage: "256GB",
        color: "Titanium",
        conditionScore: 10,
        batteryHealth: 100,
        lunexPrice: 24000,
        marketPrice: 45000,
        stockQuantity: 10,
        isAvailable: true,
      },
    ]);

    // Seed Realistic Egyptian Reviews
    const { reviews } = await import("@shared/schema");
    await db.insert(reviews).values([
      {
        productId: iphone.id,
        rating: 5,
        reviewerName: "أحمد حسن",
        title: "جهاز ممتاز جدا",
        body: "الموبايل وصلني متبرشم وتغليفه ممتاز، فعلاً كأنه جديد. البطارية 98% ومفيش فيه خربوش. أنصح بالتعامل معاهم.",
      },
      {
        productId: iphone14.id,
        rating: 4,
        reviewerName: "محمود سعد",
        title: "أفضل سعر لقيته",
        body: "السعر هنا بصراحة أرخص من برة بكتير جداً. الجهاز حالته ممتازة بس ناقصني بس إن مفيش علبة أصلية، لكن الشاحن اللي جاي معاه سريع.",
      },
      {
        productId: chineseIphone.id,
        rating: 5,
        reviewerName: "كريم ممدوح",
        title: "تجميع ممتاز مش باين الفرق",
        body: "يا جماعة أنا جبت التجميع ده ومفيش أي فرق باين بينه وبين الأصلي في الأداء، الكاميرا خرافية والشاشة ألوانها تحفة. وفرت أكتر من 20 ألف جنيه!",
      },
      {
        productId: macbookAir.id,
        rating: 5,
        reviewerName: "سارة وليد",
        title: "سرعة في التوصيل",
        body: "الماك بوك جالي تاني يوم الصبح وحالته زيرو، كيبورد عربي ومافيهوش عيب واحد. الشغل عليه ممتع جدا والبطارية بتقعد يومين.",
      },
      {
        productId: airpods.id,
        rating: 5,
        reviewerName: "عمر فاروق",
        title: "عزل رهيب للضوضاء",
        body: "السماعة التجميع دي صوتها فظيع والعزل فيها قوي جدا، ماتفرقهاش عن الأصلية بجد. أنصح بيها بشدة لو ميزانيتك مش جايبة الأصلي.",
      }
    ]);

    console.log("Database seeding complete.");
  }
}
