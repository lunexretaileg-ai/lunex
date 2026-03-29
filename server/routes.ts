import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { products, productVariants, productSpecs, categories, wishlist, orders, orderItems, users, chatSessions, chatMessages } from "@shared/schema";
import { eq, and, or, ilike, sql, desc, isNull } from "drizzle-orm";

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

  // ─── Live Search ────────────────────────────────────────────────────────────
  app.get("/api/search", async (req, res) => {
    try {
      const q = (req.query.q as string || "").trim();
      if (!q || q.length < 2) return res.json([]);

      const results = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          category: products.category,
          deviceType: products.deviceType,
          imageUrl: products.imageUrl,
        })
        .from(products)
        .where(
          or(
            ilike(products.name, `%${q}%`),
            ilike(products.description, `%${q}%`),
            ilike(products.category, `%${q}%`)
          )
        )
        .limit(8);

      // Also attach the lowest price for each result
      const resultsWithPrice = await Promise.all(
        results.map(async (p) => {
          const [cheapest] = await db
            .select({ lunexPrice: productVariants.lunexPrice })
            .from(productVariants)
            .where(and(eq(productVariants.productId, p.id), eq(productVariants.isAvailable, true)))
            .orderBy(productVariants.lunexPrice)
            .limit(1);
          return { ...p, startingPrice: cheapest?.lunexPrice ?? null };
        })
      );

      res.json(resultsWithPrice);
    } catch (error) {
      console.error("Search failed", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // ─── Variants Matrix (for Build Device page) ─────────────────────────────
  // Returns all available variants for a product grouped for step-by-step selection
  app.get("/api/products/:slug/variants-matrix", async (req, res) => {
    try {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.slug, req.params.slug))
        .limit(1);

      if (!product.length) return res.status(404).json({ message: "Product not found" });

      const variants = await db
        .select()
        .from(productVariants)
        .where(and(eq(productVariants.productId, product[0].id), eq(productVariants.isAvailable, true)));

      // Build matrix: colors → storages → deviceTypes
      const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
      const storages = Array.from(new Set(variants.map(v => v.storage).filter(Boolean)));

      // For each (color, storage) combo, list available device types with stock
      type DeviceTypeEntry = { deviceType: string; conditionScore: number; batteryHealth: number; lunexPrice: number; marketPrice: number; stockQuantity: number; variantId: number };
      const matrix: Record<string, Record<string, DeviceTypeEntry[]>> = {};
      for (const color of colors) {
        matrix[color as string] = {};
        for (const storage of storages) {
          const matches = variants.filter(v => v.color === color && v.storage === storage);
          if (matches.length > 0) {
            matrix[color as string][storage as string] = matches.map(v => ({
              deviceType: v.deviceType || product[0].deviceType,
              conditionScore: v.conditionScore,
              batteryHealth: v.batteryHealth,
              lunexPrice: v.lunexPrice,
              marketPrice: v.marketPrice,
              stockQuantity: v.stockQuantity,
              variantId: v.id,
            }));
          }
        }
      }

      res.json({ product: product[0], colors, storages, matrix, variants });
    } catch (error) {
      console.error("Variants matrix failed", error);
      res.status(500).json({ message: "Failed to fetch variants matrix" });
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

      const result = await db.transaction(async (tx) => {
        // 1. Insert Order
        const [newOrder] = await tx
          .insert(orders)
          .values({
            userId: orderData.userId || null,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            governorate: orderData.governorate,
            city: orderData.city,
            address: orderData.address,
            notes: orderData.notes || null,
            subtotal: orderData.subtotal,
            shippingFee: orderData.shippingFee,
            discount: orderData.discount,
            totalAmount: orderData.totalAmount,
            paymentMethod: orderData.paymentMethod,
            paymentWallet: orderData.paymentWallet,
            paymentReceipt: orderData.paymentReceipt || null,
            cardLastFour: orderData.cardLastFour || null,
            status: "pending",
          })
          .returning();

        // 2. Insert Order Items + Decrement Stock
        if (orderData.items && orderData.items.length > 0) {
          const itemsToInsert = orderData.items.map((item: any) => ({
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          }));
          await tx.insert(orderItems).values(itemsToInsert);

          // Decrement stock for each ordered variant
          for (const item of orderData.items) {
            await tx
              .update(productVariants)
              .set({
                stockQuantity: sql`GREATEST(0, ${productVariants.stockQuantity} - ${item.quantity})`,
                isAvailable: sql`CASE WHEN ${productVariants.stockQuantity} - ${item.quantity} <= 0 THEN false ELSE true END`,
              })
              .where(eq(productVariants.id, item.productVariantId));
          }
        }

        return newOrder;
      });

      res.status(201).json({ orderId: result.id, ...result });
    } catch (error) {
      console.error("Failed to create order", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // My orders — fetch by userId (preferred) or email (fallback)
  app.get("/api/my-orders", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      const userEmail = (req as any).user?.email || req.query.email as string || null;

      let myOrders;
      if (userId && !isNaN(userId)) {
        myOrders = await db.query.orders.findMany({
          where: (orders, { eq }) => eq(orders.userId, userId),
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
      } else if (userEmail) {
        myOrders = await db.query.orders.findMany({
          where: (orders, { ilike }) => ilike(orders.customerEmail, userEmail),
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
      } else {
        return res.json([]);
      }
      res.json(myOrders);
    } catch (error) {
      console.error("Failed to fetch my-orders", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Submit InstaPay Transfer Evidence
  app.post("/api/orders/:id/transfer-evidence", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

      const { transferAmount, transferSender, transferScreenshot } = req.body;
      if (!transferAmount || !transferSender || !transferScreenshot) {
        return res.status(400).json({ message: "Missing transfer evidence details" });
      }

      await db
        .update(orders)
        .set({
          transferAmount,
          transferSender,
          transferScreenshot,
          status: "processing", // Move to processing automatically
        })
        .where(eq(orders.id, orderId));

      res.status(200).json({ message: "Evidence submitted successfully" });
    } catch (error) {
      console.error("Failed to submit transfer evidence", error);
      res.status(500).json({ message: "Failed to submit evidence" });
    }
  });

  // Admin API - Orders
  app.get("/api/admin/orders", async (req, res) => {
    try {
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

  // Admin API - Update Order Status
  app.patch("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const [updated] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, parseInt(req.params.id)))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin API - Update Order Payment Handle
  app.patch("/api/admin/orders/:id/payment-handle", async (req, res) => {
    try {
      const { handle } = req.body;
      if (!handle) return res.status(400).json({ message: "Handle is required" });
      
      const [updated] = await db
        .update(orders)
        .set({ merchantPaymentHandle: handle })
        .where(eq(orders.id, parseInt(req.params.id)))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment handle" });
    }
  });

  // Get current user profile from DB
  app.get("/api/users/me", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) return res.status(400).json({ message: "Email required" });
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
        
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin API - All Users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          phone: users.phone,
          role: users.role,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(users.createdAt);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin API - Toggle User Admin
  app.patch("/api/admin/users/:id/role", async (req, res) => {
    try {
      const { role, isAdmin } = req.body;
      const [updated] = await db
        .update(users)
        .set({ role, isAdmin })
        .where(eq(users.id, parseInt(req.params.id)))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Admin API - Update Variant Stock
  app.patch("/api/admin/variants/:id/stock", async (req, res) => {
    try {
      const { stockQuantity } = req.body;
      const [updated] = await db
        .update(productVariants)
        .set({
          stockQuantity,
          isAvailable: stockQuantity > 0,
        })
        .where(eq(productVariants.id, parseInt(req.params.id)))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update stock" });
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

  // ===================================
  // --- CHAT API (Customer & Admin) ---
  // ===================================

  // Get active session for user/guest
  app.get("/api/chat/session", async (req, res) => {
    const userHeader = req.headers["x-user-id"];
    const guestId = req.query.guestId as string;
    try {
      let session;
      if (userHeader) {
        [session] = await db.select().from(chatSessions)
          .where(and(eq(chatSessions.userId, parseInt(userHeader as string)), eq(chatSessions.status, "active")))
          .limit(1);
      } else if (guestId) {
        [session] = await db.select().from(chatSessions)
          .where(and(eq(chatSessions.guestId, guestId), eq(chatSessions.status, "active")))
          .limit(1);
      }
      res.json(session || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  // Create new chat session
  app.post("/api/chat/session", async (req, res) => {
    const userHeader = req.headers["x-user-id"];
    const { guestId } = req.body;
    try {
      const [session] = await db.insert(chatSessions).values({
        userId: userHeader ? parseInt(userHeader as string) : null,
        guestId: (!userHeader && guestId) ? guestId : null,
        status: "active"
      }).returning();
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  // Get messages for a session
  app.get("/api/chat/session/:id/messages", async (req, res) => {
    try {
      const messages = await db.select().from(chatMessages)
        .where(eq(chatMessages.sessionId, parseInt(req.params.id)))
        .orderBy(chatMessages.createdAt);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to load messages" });
    }
  });

  // Send a message
  app.post("/api/chat/session/:id/messages", async (req, res) => {
    const userHeader = req.headers["x-user-id"];
    const { content, isAdmin } = req.body;
    try {
      const [msg] = await db.insert(chatMessages).values({
        sessionId: parseInt(req.params.id),
        senderId: userHeader ? parseInt(userHeader as string) : null,
        isAdmin: isAdmin || false,
        content
      }).returning();
      res.json(msg);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin: Get all chat sessions (with latest message and user info if available)
  app.get("/api/admin/chat/sessions", async (req, res) => {
    try {
      // Using basic select then fetching user details to keep it simple, though join is better
      const sessions = await db.select().from(chatSessions).orderBy(desc(chatSessions.createdAt));
      // For each session, fetch the user if it exists and the last message content
      const enriched = await Promise.all(sessions.map(async (s) => {
        let user: any = null;
        if (s.userId) {
          const [u] = await db.select({ fullName: users.fullName, email: users.email }).from(users).where(eq(users.id, s.userId));
          user = u;
        }
        const [lastMsg] = await db.select().from(chatMessages)
          .where(eq(chatMessages.sessionId, s.id))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1);
          
        return {
          ...s,
          user,
          lastMessage: lastMsg?.content || "No messages yet",
          lastMessageAt: lastMsg?.createdAt || s.createdAt
        };
      }));
      res.json(enriched);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all sessions" });
    }
  });

  // Admin: Update session status
  app.patch("/api/admin/chat/sessions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const [session] = await db.update(chatSessions)
        .set({ status })
        .where(eq(chatSessions.id, parseInt(req.params.id)))
        .returning();
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session status" });
    }
  });

  // Admin: Force reseed endpoint (clears products and re-seeds fresh)
  app.post("/api/admin/reseed", async (_req, res) => {
    try {
      console.log("Force reseed requested — clearing all product data...");
      const { reviews } = await import("@shared/schema");
      // Delete in FK-safe order
      await db.delete(reviews);
      await db.delete(productSpecs);
      await db.delete(productVariants);
      await db.delete(products);
      await db.delete(categories);
      console.log("All product data cleared. Reseeding...");
      await seedDatabase();
      res.json({ success: true, message: "Database reseeded successfully." });
    } catch (error: any) {
      console.error("Reseed failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Seed data function to insert some sample data on startup
  await runMigrations().catch(console.error);
  await seedDatabase().catch(console.error);

  return httpServer;
}

async function runMigrations() {
  // Add cosmetic_condition column if it doesn't exist
  await db.execute(sql`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS cosmetic_condition text`);
  // Create categories table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS categories (
      id serial PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      name text NOT NULL,
      icon text,
      sort_order integer NOT NULL DEFAULT 0
    )
  `);
  // Create product_specs table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS product_specs (
      id serial PRIMARY KEY,
      product_id integer NOT NULL REFERENCES products(id),
      spec_key text NOT NULL,
      spec_value text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0
    )
  `);
  // Add variant_id column to product_specs if it doesn't exist
  await db.execute(sql`ALTER TABLE product_specs ADD COLUMN IF NOT EXISTS variant_id integer REFERENCES product_variants(id)`);
}

async function seedDatabase() {
  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length === 0) {
    console.log("Seeding database with initial Apple devices and reviews...");
    
    // Seed Categories
    const existingCats = await db.select().from(categories).limit(1);
    if (existingCats.length === 0) {
      await db.insert(categories).values([
        { slug: "iphone", name: "iPhone", icon: "Smartphone", sortOrder: 1 },
        { slug: "mac", name: "Mac", icon: "Laptop", sortOrder: 2 },
        { slug: "ipad", name: "iPad", icon: "Tablet", sortOrder: 3 },
        { slug: "watch", name: "Watch", icon: "Watch", sortOrder: 4 },
        { slug: "airpods", name: "AirPods", icon: "Headphones", sortOrder: 5 }
      ]);
    }
    
    // iPhone 15 Pro — Refurbished
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
      { productId: iphone.id, storage: "256GB", color: "Natural Titanium", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_15_Pro_Natural_Titanium_PDP_Image_Position-1__en-US_c9b8fcf6-9289-4fc3-a4c8-3d2331fc3a9d.jpg", conditionScore: 9, batteryHealth: 98, cosmeticCondition: "Hairline micro-scratch on bottom edge, invisible under screen protector", lunexPrice: 42000, marketPrice: 52000, stockQuantity: 5, isAvailable: true },
      { productId: iphone.id, storage: "128GB", color: "Blue Titanium", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_15_Pro_Blue_Titanium_PDP_Image_Position-1__en-US_74cb2e60-44ec-4fcf-bc0a-eecdc026c04f.jpg", conditionScore: 8, batteryHealth: 88, cosmeticCondition: "Light scratches on back panel, excellent screen", lunexPrice: 38000, marketPrice: 48000, stockQuantity: 3, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: iphone.id, specKey: "Chip", specValue: "Apple A17 Pro (3nm)", sortOrder: 0 },
      { productId: iphone.id, specKey: "Display", specValue: "6.1\" Super Retina XDR OLED, 120Hz ProMotion", sortOrder: 1 },
      { productId: iphone.id, specKey: "Camera", specValue: "48MP Main + 12MP UW + 12MP 3× Telephoto", sortOrder: 2 },
      { productId: iphone.id, specKey: "Front Camera", specValue: "12MP TrueDepth with Face ID", sortOrder: 3 },
      { productId: iphone.id, specKey: "Build", specValue: "Titanium frame, textured matte glass back", sortOrder: 4 },
      { productId: iphone.id, specKey: "Connectivity", specValue: "5G, Wi-Fi 6E, Bluetooth 5.3, USB-C (USB 3)", sortOrder: 5 },
      { productId: iphone.id, specKey: "OS", specValue: "iOS 17 (upgradeable)", sortOrder: 6 },
    ]);

    // iPhone 14 Pro Max — Open Box
    const [iphone14] = await db.insert(products).values({
      name: "iPhone 14 Pro Max",
      slug: "iphone-14-pro-max",
      category: "iphone",
      deviceType: "open_box",
      releaseYear: 2022,
      description: "ProMotion display, A16 Bionic chip, and an advanced camera system — at a Lunex price up to 40% below Egypt market.",
      imageUrl: "https://images.unsplash.com/photo-1664472896721-ec8e36c46f17?auto=format&fit=crop&q=80&w=1000",
    }).returning();
    await db.insert(productVariants).values([
      { productId: iphone14.id, storage: "256GB", color: "Deep Purple", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_14_Pro_Max_Deep_Purple_PDP_Image_Position-1a__en-US_4af41b23-1463-4416-95bb-20e3fb592aa1.jpg", conditionScore: 9, batteryHealth: 95, cosmeticCondition: "Opened display unit — no cosmetic defects", lunexPrice: 36000, marketPrice: 48000, stockQuantity: 4, isAvailable: true },
      { productId: iphone14.id, storage: "128GB", color: "Space Black", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_14_Pro_Max_Space_Black_PDP_Image_Position-1a__en-US_9043c7b7-b08e-4a67-b52b-fc9dc6d48261.jpg", conditionScore: 8, batteryHealth: 90, cosmeticCondition: "Returned after 2 days use — near perfect condition", lunexPrice: 33000, marketPrice: 44000, stockQuantity: 5, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: iphone14.id, specKey: "Chip", specValue: "Apple A16 Bionic (4nm)", sortOrder: 0 },
      { productId: iphone14.id, specKey: "Display", specValue: "6.7\" Super Retina XDR OLED, 120Hz ProMotion", sortOrder: 1 },
      { productId: iphone14.id, specKey: "Camera", specValue: "48MP Main + 12MP UW + 12MP 3× Telephoto", sortOrder: 2 },
      { productId: iphone14.id, specKey: "Build", specValue: "Stainless steel frame, Ceramic Shield front", sortOrder: 3 },
      { productId: iphone14.id, specKey: "Connectivity", specValue: "5G, Wi-Fi 6, Bluetooth 5.3, Lightning", sortOrder: 4 },
    ]);

    // iPhone 13 — Used
    const [iphone13] = await db.insert(products).values({
      name: "iPhone 13",
      slug: "iphone-13",
      category: "iphone",
      deviceType: "used",
      releaseYear: 2021,
      description: "The perfect balance of performance and value with A15 Bionic and excellent battery life.",
      imageUrl: "https://images.unsplash.com/photo-1636054803552-6a1e6c01f4e9?auto=format&fit=crop&q=80&w=1000",
    }).returning();
    await db.insert(productVariants).values([
      { productId: iphone13.id, storage: "128GB", color: "Midnight", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_13_Midnight_PDP_Image_Position-1A__en-US_5cfd5bbf-8ae2-4fc3-a55d-ef571d4bf847.jpg", conditionScore: 8, batteryHealth: 92, cosmeticCondition: "Normal use marks on frame, screen flawless", lunexPrice: 23000, marketPrice: 32000, stockQuantity: 7, isAvailable: true },
      { productId: iphone13.id, storage: "256GB", color: "Starlight", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_13_Starlight_PDP_Image_Position-1A__en-US_dd2c7009-40fe-4299-8bd5-14fdd05ba934.jpg", conditionScore: 7, batteryHealth: 88, cosmeticCondition: "Visible scratches on back, all functions perfect", lunexPrice: 25000, marketPrice: 35000, stockQuantity: 3, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: iphone13.id, specKey: "Chip", specValue: "Apple A15 Bionic (5nm)", sortOrder: 0 },
      { productId: iphone13.id, specKey: "Display", specValue: "6.1\" Super Retina XDR OLED, 60Hz", sortOrder: 1 },
      { productId: iphone13.id, specKey: "Camera", specValue: "12MP Main + 12MP Ultra Wide (Cinematic Mode)", sortOrder: 2 },
      { productId: iphone13.id, specKey: "Connectivity", specValue: "5G, Wi-Fi 6, Bluetooth 5.0, Lightning", sortOrder: 3 },
    ]);

    // iPhone SE (3rd gen) — Assembled
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
      { productId: iphoneSe.id, storage: "64GB", color: "Product Red", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-red-select-202203?wid=940&hei=1112&fmt=png-alpha&.v=1646052864706", conditionScore: 8, batteryHealth: 94, cosmeticCondition: "New housing, new battery, all original internals", lunexPrice: 14500, marketPrice: 21000, stockQuantity: 6, isAvailable: true },
      { productId: iphoneSe.id, storage: "128GB", color: "Midnight", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-midnight-select-202203?wid=940&hei=1112&fmt=png-alpha&.v=1646052864906", conditionScore: 9, batteryHealth: 100, cosmeticCondition: "Brand new parts — feels factory fresh", lunexPrice: 16500, marketPrice: 24000, stockQuantity: 4, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: iphoneSe.id, specKey: "Chip", specValue: "Apple A15 Bionic (5nm)", sortOrder: 0 },
      { productId: iphoneSe.id, specKey: "Display", specValue: "4.7\" Retina IPS LCD, 60Hz", sortOrder: 1 },
      { productId: iphoneSe.id, specKey: "Camera", specValue: "12MP Main with OIS", sortOrder: 2 },
      { productId: iphoneSe.id, specKey: "Authentication", specValue: "Touch ID (Home button)", sortOrder: 3 },
      { productId: iphoneSe.id, specKey: "Connectivity", specValue: "5G, Wi-Fi 6, Bluetooth 5.0, Lightning", sortOrder: 4 },
    ]);

    // MacBook Pro 14" — Open Box
    const [macbook] = await db.insert(products).values({
      name: "MacBook Pro 14\"",
      slug: "macbook-pro-14-m3",
      category: "mac",
      deviceType: "open_box",
      releaseYear: 2023,
      description: "Mind-blowing performance with the M3 chip. Brilliant Liquid Retina XDR display. Up to 22 hours of battery life.",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
    }).returning();
    await db.insert(productVariants).values([
      { productId: macbook.id, storage: "512GB", color: "Space Black", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "Opened for display only, never used", lunexPrice: 75000, marketPrice: 95000, stockQuantity: 2, isAvailable: true },
      { productId: macbook.id, storage: "1TB", color: "Silver", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "Opened but unused — complete original packaging", lunexPrice: 85000, marketPrice: 110000, stockQuantity: 1, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: macbook.id, specKey: "Chip", specValue: "Apple M3 (8-core CPU, 10-core GPU)", sortOrder: 0 },
      { productId: macbook.id, specKey: "Memory", specValue: "8GB unified memory", sortOrder: 1 },
      { productId: macbook.id, specKey: "Display", specValue: "14.2\" Liquid Retina XDR, 3024×1964, 120Hz", sortOrder: 2 },
      { productId: macbook.id, specKey: "Battery", specValue: "Up to 22 hours", sortOrder: 3 },
      { productId: macbook.id, specKey: "Ports", specValue: "3× Thunderbolt 4, HDMI 2.1, SD card, MagSafe 3", sortOrder: 4 },
      { productId: macbook.id, specKey: "Connectivity", specValue: "Wi-Fi 6E, Bluetooth 5.3", sortOrder: 5 },
    ]);

    // MacBook Air M1 — Refurbished
    const [macbookAir] = await db.insert(products).values({
      name: "MacBook Air 13\" M1",
      slug: "macbook-air-13-m1",
      category: "mac",
      deviceType: "refurbished",
      releaseYear: 2020,
      description: "Iconic thin-and-light MacBook Air with the M1 chip and all‑day battery life.",
      imageUrl: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=1000",
    }).returning();
    const macbookAirVariants = await db.insert(productVariants).values([
      { productId: macbookAir.id, storage: "256GB", color: "Space Gray", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-201810?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1664472289661", conditionScore: 9, batteryHealth: 97, cosmeticCondition: "Tiny dent on back lid corner, invisible when open", lunexPrice: 32000, marketPrice: 43000, stockQuantity: 5, isAvailable: true },
      { productId: macbookAir.id, storage: "512GB", color: "Silver", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-silver-select-201810?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1664472289058", conditionScore: 8, batteryHealth: 93, cosmeticCondition: "Normal use marks on palm rest, screen spotless", lunexPrice: 35500, marketPrice: 47000, stockQuantity: 2, isAvailable: true },
    ]).returning();
    
    await db.insert(productSpecs).values([
      // Shared specs
      { productId: macbookAir.id, variantId: null, specKey: "Chip", specValue: "Apple M1 (8-core CPU, 7-core GPU)", sortOrder: 0 },
      { productId: macbookAir.id, variantId: null, specKey: "Memory", specValue: "8GB unified memory", sortOrder: 1 },
      { productId: macbookAir.id, variantId: null, specKey: "Display", specValue: "13.3\" Retina IPS, 2560×1600, True Tone", sortOrder: 2 },
      { productId: macbookAir.id, variantId: null, specKey: "Battery", specValue: "Up to 18 hours", sortOrder: 3 },
      { productId: macbookAir.id, variantId: null, specKey: "Ports", specValue: "2× Thunderbolt / USB 4, 3.5mm headphone", sortOrder: 4 },
      { productId: macbookAir.id, variantId: null, specKey: "Connectivity", specValue: "Wi-Fi 6, Bluetooth 5.0", sortOrder: 5 },
      // Variant-specific specs
      { productId: macbookAir.id, variantId: macbookAirVariants[0].id, specKey: "Storage Speed", specValue: "Standard SSD Speed", sortOrder: 10 },
      { productId: macbookAir.id, variantId: macbookAirVariants[1].id, specKey: "Storage Speed", specValue: "Ultra Fast NVMe SSD", sortOrder: 10 },
    ]);

    // iPad Air — Refurbished
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
      { productId: ipadAir.id, storage: "64GB", color: "Blue", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202203-blue?wid=940&hei=1112&fmt=png-alpha&.v=1645066735749", conditionScore: 9, batteryHealth: 96, cosmeticCondition: "Pristine — no visible marks", lunexPrice: 21000, marketPrice: 29000, stockQuantity: 4, isAvailable: true },
      { productId: ipadAir.id, storage: "256GB", color: "Space Gray", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-storage-select-202203-space-gray?wid=940&hei=1112&fmt=png-alpha&.v=1645066738596", conditionScore: 8, batteryHealth: 92, cosmeticCondition: "Minor scuff on corner, screen and back excellent", lunexPrice: 25500, marketPrice: 34000, stockQuantity: 3, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: ipadAir.id, specKey: "Chip", specValue: "Apple M1 (8-core CPU, 8-core GPU)", sortOrder: 0 },
      { productId: ipadAir.id, specKey: "Display", specValue: "10.9\" Liquid Retina, 2360×1640, True Tone", sortOrder: 1 },
      { productId: ipadAir.id, specKey: "Camera", specValue: "12MP rear, 12MP UW front (Center Stage)", sortOrder: 2 },
      { productId: ipadAir.id, specKey: "Connectivity", specValue: "Wi-Fi 6, USB-C, optional 5G", sortOrder: 3 },
      { productId: ipadAir.id, specKey: "Apple Pencil", specValue: "2nd gen compatible", sortOrder: 4 },
    ]);

    // Apple Watch Series 9 — New
    const [watch] = await db.insert(products).values({
      name: "Apple Watch Series 9",
      slug: "apple-watch-series-9",
      category: "watch",
      deviceType: "new",
      releaseYear: 2023,
      description: "Advanced health features, always‑on display, and all‑day battery — tailored for your daily routine.",
      imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=1000",
    }).returning();
    await db.insert(productVariants).values([
      { productId: watch.id, storage: null, color: "Midnight", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9_VW_PF_WF_CO?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1694507905569", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "Factory sealed — brand new", lunexPrice: 15500, marketPrice: 22000, stockQuantity: 6, isAvailable: true },
      { productId: watch.id, storage: null, color: "Starlight", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-45-aluminum-starlight-nc-s9_VW_PF_WF_CO?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1694507905597", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "Factory sealed — brand new", lunexPrice: 15500, marketPrice: 22000, stockQuantity: 4, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: watch.id, specKey: "Chip", specValue: "Apple S9 SiP (dual-core CPU)", sortOrder: 0 },
      { productId: watch.id, specKey: "Display", specValue: "Always-On Retina LTPO OLED, 2000 nits", sortOrder: 1 },
      { productId: watch.id, specKey: "Health Sensors", specValue: "Blood oxygen, ECG, temperature, heart rate", sortOrder: 2 },
      { productId: watch.id, specKey: "Battery", specValue: "Up to 18 hours (36h Low Power Mode)", sortOrder: 3 },
      { productId: watch.id, specKey: "Water Resistance", specValue: "WR50 (50 metres)", sortOrder: 4 },
      { productId: watch.id, specKey: "Connectivity", specValue: "Wi-Fi, Bluetooth 5.3, optional LTE", sortOrder: 5 },
    ]);

    // AirPods Pro 2nd Gen — Assembled
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
      { productId: airpods.id, storage: null, color: "White", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1632861342000", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "New premium compatible components, identical performance", lunexPrice: 7500, marketPrice: 11500, stockQuantity: 15, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: airpods.id, specKey: "Chip", specValue: "H2-compatible (premium)", sortOrder: 0 },
      { productId: airpods.id, specKey: "ANC", specValue: "Active Noise Cancellation + Adaptive Transparency", sortOrder: 1 },
      { productId: airpods.id, specKey: "Battery", specValue: "6hrs earbuds (30hrs with case)", sortOrder: 2 },
      { productId: airpods.id, specKey: "Connectivity", specValue: "Bluetooth 5.3, MagSafe charging case", sortOrder: 3 },
    ]);

    // AirPods Max — Refurbished
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
      { productId: airpodsMax.id, storage: null, color: "Sky Blue", imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-skyblue-202011?wid=940&hei=1112&fmt=png-alpha&.v=1604021223000", conditionScore: 9, batteryHealth: 100, cosmeticCondition: "Micro scratch on left headband, fully invisible", lunexPrice: 24500, marketPrice: 34000, stockQuantity: 3, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: airpodsMax.id, specKey: "Chip", specValue: "Apple H1 (dual, one per ear cup)", sortOrder: 0 },
      { productId: airpodsMax.id, specKey: "Driver", specValue: "40mm dynamic, custom neodymium", sortOrder: 1 },
      { productId: airpodsMax.id, specKey: "ANC", specValue: "Computational ANC + Transparency Mode", sortOrder: 2 },
      { productId: airpodsMax.id, specKey: "Battery", specValue: "Up to 20 hours with ANC", sortOrder: 3 },
      { productId: airpodsMax.id, specKey: "Spatial Audio", specValue: "Dynamic Head Tracking", sortOrder: 4 },
    ]);

    // iPhone 15 Pro Max — Assembled (تجميع صيني)
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
      { productId: chineseIphone.id, storage: "256GB", color: "Titanium", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_15_Pro_Natural_Titanium_PDP_Image_Position-1__en-US_c9b8fcf6-9289-4fc3-a4c8-3d2331fc3a9d.jpg", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "All new components — identical external to original", lunexPrice: 24000, marketPrice: 45000, stockQuantity: 10, isAvailable: true },
      { productId: chineseIphone.id, storage: "512GB", color: "Black Titanium", imageUrl: "https://lunexstore.com/cdn/shop/files/iPhone_15_Pro_Black_Titanium_PDP_Image_Position-1__en-US_c9b8fcf6-9289-4fc3-a4c8-3d2331fc3a9d.jpg", conditionScore: 10, batteryHealth: 100, cosmeticCondition: "All new components — identical external to original", lunexPrice: 28000, marketPrice: 52000, stockQuantity: 5, isAvailable: true },
    ]);
    await db.insert(productSpecs).values([
      { productId: chineseIphone.id, specKey: "Chip", specValue: "A17 Pro compatible (premium Chinese chip)", sortOrder: 0 },
      { productId: chineseIphone.id, specKey: "Display", specValue: "6.7\" OLED, 120Hz ProMotion (premium panel)", sortOrder: 1 },
      { productId: chineseIphone.id, specKey: "Camera", specValue: "48MP Main + 12MP UW + 12MP Telephoto", sortOrder: 2 },
      { productId: chineseIphone.id, specKey: "Build", specValue: "Titanium-finish frame, original Apple housing", sortOrder: 3 },
      { productId: chineseIphone.id, specKey: "Connectivity", specValue: "5G, Wi-Fi 6, Bluetooth, USB-C", sortOrder: 4 },
    ]);

    // Seed Reviews
    const { reviews } = await import("@shared/schema");
    await db.insert(reviews).values([
      { productId: iphone.id, rating: 5, reviewerName: "أحمد حسن", title: "جهاز ممتاز جدا", body: "الموبايل وصلني متبرشم وتغليفه ممتاز، فعلاً كأنه جديد. البطارية 98% ومفيش فيه خربوش. أنصح بالتعامل معاهم." },
      { productId: iphone14.id, rating: 4, reviewerName: "محمود سعد", title: "أفضل سعر لقيته", body: "السعر هنا بصراحة أرخص من برة بكتير جداً. الجهاز حالته ممتازة بس ناقصني بس إن مفيش علبة أصلية، لكن الشاحن اللي جاي معاه سريع." },
      { productId: chineseIphone.id, rating: 5, reviewerName: "كريم ممدوح", title: "تجميع ممتاز مش باين الفرق", body: "يا جماعة أنا جبت التجميع ده ومفيش أي فرق باين بينه وبين الأصلي في الأداء، الكاميرا خرافية والشاشة ألوانها تحفة. وفرت أكتر من 20 ألف جنيه!" },
      { productId: macbookAir.id, rating: 5, reviewerName: "سارة وليد", title: "سرعة في التوصيل", body: "الماك بوك جالي تاني يوم الصبح وحالته زيرو، كيبورد عربي ومافيهوش عيب واحد. الشغل عليه ممتع جدا والبطارية بتقعد يومين." },
      { productId: airpods.id, rating: 5, reviewerName: "عمر فاروق", title: "عزل رهيب للضوضاء", body: "السماعة التجميع دي صوتها فظيع والعزل فيها قوي جدا، ماتفرقهاش عن الأصلية بجد. أنصح بيها بشدة لو ميزانيتك مش جايبة الأصلي." },
    ]);

    console.log("Database seeding complete.");
  }
}
