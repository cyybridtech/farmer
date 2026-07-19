import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eq, like, and, or } from "drizzle-orm";
import { db } from "./db/index.js";
import {
  users,
  categories,
  products,
  marketPrices,
  orders,
  reviews,
} from "./db/schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Run simple query to test connection
    await db.execute("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 2. Categories endpoint
app.get("/api/categories", async (req, res) => {
  try {
    const cats = await db.select().from(categories).orderBy(categories.name);
    res.json(cats);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// 3. Market Prices endpoint
app.get("/api/market-prices", async (req, res) => {
  try {
    const prices = await db
      .select({
        id: marketPrices.id,
        productName: marketPrices.productName,
        minPrice: marketPrices.minPrice,
        maxPrice: marketPrices.maxPrice,
        avgPrice: marketPrices.avgPrice,
        unit: marketPrices.unit,
        region: marketPrices.region,
        trend: marketPrices.trend,
        updatedAt: marketPrices.updatedAt,
        categoryName: categories.name,
        categoryIcon: categories.icon,
      })
      .from(marketPrices)
      .leftJoin(categories, eq(marketPrices.categoryId, categories.id))
      .orderBy(marketPrices.productName);

    res.json(prices);
  } catch (error) {
    console.error("GET /api/market-prices error:", error);
    res.status(500).json({ error: "Failed to fetch market prices" });
  }
});

// 4. Orders endpoints
app.get("/api/orders", async (req, res) => {
  try {
    const buyerId = req.query.buyerId;

    const query = db
      .select({
        id: orders.id,
        quantity: orders.quantity,
        totalPrice: orders.totalPrice,
        status: orders.status,
        deliveryAddress: orders.deliveryAddress,
        notes: orders.notes,
        createdAt: orders.createdAt,
        productTitle: products.title,
        productUnit: products.unit,
        productImage: products.imageUrl,
        farmerName: users.name,
        farmerPhone: users.phone,
      })
      .from(orders)
      .leftJoin(products, eq(orders.productId, products.id))
      .leftJoin(users, eq(products.farmerId, users.id))
      .orderBy(orders.createdAt);

    if (buyerId) {
      const result = await query.where(eq(orders.buyerId, Number(buyerId)));
      return res.json(result);
    }

    const result = await query;
    res.json(result);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { buyerId, productId, quantity, deliveryAddress, notes } = req.body;

    if (!buyerId || !productId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get product price
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(productId)))
      .limit(1);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const totalPrice = parseFloat(product.pricePerUnit) * parseFloat(String(quantity));

    const [result] = await db.insert(orders).values({
      buyerId: Number(buyerId),
      productId: Number(productId),
      quantity: String(quantity),
      totalPrice: String(totalPrice.toFixed(2)),
      status: "pending",
      deliveryAddress,
      notes,
    });

    const [newOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, result.insertId))
      .limit(1);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("POST /api/orders error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 5. Products endpoints
app.get("/api/products", async (req, res) => {
  try {
    const { category, search, organic } = req.query;

    const conditions = [eq(products.status, "active")];

    if (category && category !== "all") {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.name, String(category)))
        .limit(1);
      if (cat.length > 0) {
        conditions.push(eq(products.categoryId, cat[0].id));
      }
    }

    if (search) {
      conditions.push(
        or(
          like(products.title, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.location, `%${search}%`)
        )
      );
    }

    if (organic === "true") {
      conditions.push(eq(products.organic, true));
    }

    const rows = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        pricePerUnit: products.pricePerUnit,
        unit: products.unit,
        quantityAvailable: products.quantityAvailable,
        location: products.location,
        imageUrl: products.imageUrl,
        status: products.status,
        organic: products.organic,
        createdAt: products.createdAt,
        farmerName: users.name,
        farmerPhone: users.phone,
        farmerLocation: users.location,
        farmerInitials: users.avatarInitials,
        categoryName: categories.name,
        categoryIcon: categories.icon,
      })
      .from(products)
      .leftJoin(users, eq(products.farmerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(products.createdAt);

    res.json(rows);
  } catch (error) {
    console.error("GET /api/products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const {
      farmerId,
      categoryId,
      title,
      description,
      pricePerUnit,
      unit,
      quantityAvailable,
      location,
      organic,
    } = req.body;

    if (!farmerId || !categoryId || !title || !pricePerUnit || !unit || !quantityAvailable) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imageUrls = [
      "https://images.pexels.com/photos/31834232/pexels-photo-31834232.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      "https://images.pexels.com/photos/5425893/pexels-photo-5425893.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      "https://images.pexels.com/photos/31776842/pexels-photo-31776842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      "https://images.pexels.com/photos/12955498/pexels-photo-12955498.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    ];

    const [result] = await db.insert(products).values({
      farmerId: Number(farmerId),
      categoryId: Number(categoryId),
      title,
      description,
      pricePerUnit: String(pricePerUnit),
      unit,
      quantityAvailable: String(quantityAvailable),
      location,
      organic: Boolean(organic),
      imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      status: "active",
    });

    const [newProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, result.insertId))
      .limit(1);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("POST /api/products error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// 6. Users endpoints
app.get("/api/users", async (req, res) => {
  try {
    const role = req.query.role;

    if (role) {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.role, role))
        .orderBy(users.name);
      return res.json(result);
    }

    const result = await db.select().from(users).orderBy(users.name);
    res.json(result);
  } catch (error) {
    console.error("GET /api/users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, phone, role, location } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const [result] = await db.insert(users).values({
      name,
      email,
      phone,
      role,
      location,
      avatarInitials: initials,
    });

    const [newUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, result.insertId))
      .limit(1);

    res.status(201).json(newUser);
  } catch (error) {
    console.error("POST /api/users error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port http://localhost:${PORT}`);
});
