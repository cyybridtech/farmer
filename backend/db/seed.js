import "dotenv/config";
import { db, pool } from "./index.js";
import {
  users,
  categories,
  products,
  marketPrices,
  orders,
  reviews,
} from "./schema.js";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data (children first due to foreign keys)
  await db.delete(reviews);
  await db.delete(orders);
  await db.delete(marketPrices);
  await db.delete(products);
  await db.delete(users);
  await db.delete(categories);

  // Categories
  await db.insert(categories).values([
    { name: "Vegetables", icon: "🥦", description: "Fresh farm vegetables" },
    { name: "Fruits", icon: "🍎", description: "Seasonal fresh fruits" },
    { name: "Grains & Cereals", icon: "🌾", description: "Rice, maize, millet and more" },
    { name: "Legumes", icon: "🫘", description: "Beans, groundnuts, cowpeas" },
    { name: "Tubers & Roots", icon: "🥕", description: "Cassava, yam, plantain, cocoyam" },
    { name: "Dairy & Eggs", icon: "🥛", description: "Fresh dairy products and eggs" },
  ]);
  const cats = await db.select().from(categories).orderBy(categories.id);
  console.log("✅ Categories seeded");

  // Users (Ghana phone numbers: +233)
  await db.insert(users).values([
    {
      name: "Kwame Mensah",
      email: "kwame.mensah@farm.com",
      phone: "+233244123456",
      role: "farmer",
      location: "Kumasi, Ghana",
      avatarInitials: "KM",
    },
    {
      name: "Akosua Boateng",
      email: "akosua.b@farm.com",
      phone: "+233244234567",
      role: "farmer",
      location: "Tamale, Ghana",
      avatarInitials: "AB",
    },
    {
      name: "Kofi Asante",
      email: "kofi.a@farm.com",
      phone: "+233244345678",
      role: "farmer",
      location: "Takoradi, Ghana",
      avatarInitials: "KA",
    },
    {
      name: "Ama Owusu",
      email: "ama.o@farm.com",
      phone: "+233244456789",
      role: "farmer",
      location: "Cape Coast, Ghana",
      avatarInitials: "AO",
    },
    {
      name: "Yaw Adjei",
      email: "yaw.a@buy.com",
      phone: "+233244567890",
      role: "buyer",
      location: "Accra, Ghana",
      avatarInitials: "YA",
    },
    {
      name: "Efua Ankrah",
      email: "efua.a@buy.com",
      phone: "+233244678901",
      role: "buyer",
      location: "Kumasi, Ghana",
      avatarInitials: "EA",
    },
  ]);
  const usersData = await db.select().from(users).orderBy(users.id);
  console.log("✅ Users seeded");

  const farmers = usersData.filter((u) => u.role === "farmer");
  const buyers = usersData.filter((u) => u.role === "buyer");

  // Products (GHS prices)
  await db.insert(products).values([
    {
      farmerId: farmers[0].id,
      categoryId: cats[0].id,
      title: "Fresh Tomatoes",
      description: "Sun-ripened tomatoes from the fertile Kumasi highlands. Perfect for stews, salads, and cooking.",
      pricePerUnit: "8.00",
      unit: "kg",
      quantityAvailable: "500",
      location: "Kumasi, Ghana",
      imageUrl: "https://images.pexels.com/photos/31834232/pexels-photo-31834232.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: true,
      status: "active",
    },
    {
      farmerId: farmers[1].id,
      categoryId: cats[1].id,
      title: "Sweet Mangoes",
      description: "Juicy ripe mangoes from Tamale. Naturally sweet with no artificial ripening.",
      pricePerUnit: "12.00",
      unit: "kg",
      quantityAvailable: "300",
      location: "Tamale, Ghana",
      imageUrl: "https://images.pexels.com/photos/5425893/pexels-photo-5425893.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: true,
      status: "active",
    },
    {
      farmerId: farmers[2].id,
      categoryId: cats[2].id,
      title: "White Maize",
      description: "High-quality dried white maize, freshly harvested. Ideal for flour milling or direct consumption.",
      pricePerUnit: "5.50",
      unit: "kg",
      quantityAvailable: "2000",
      location: "Takoradi, Ghana",
      imageUrl: "https://images.pexels.com/photos/31776842/pexels-photo-31776842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: false,
      status: "active",
    },
    {
      farmerId: farmers[3].id,
      categoryId: cats[4].id,
      title: "Fresh Cassava",
      description: "Fresh cassava tubers from Cape Coast. Clean, large-sized, perfect for fufu, gari or kokonte.",
      pricePerUnit: "4.00",
      unit: "kg",
      quantityAvailable: "1000",
      location: "Cape Coast, Ghana",
      imageUrl: "https://images.pexels.com/photos/12955498/pexels-photo-12955498.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: false,
      status: "active",
    },
    {
      farmerId: farmers[0].id,
      categoryId: cats[0].id,
      title: "Kontomire (Cocoyam Leaves)",
      description: "Freshly cut kontomire, washed and bundled. Rich in vitamins and minerals, perfect for kontomire stew.",
      pricePerUnit: "3.00",
      unit: "bunch",
      quantityAvailable: "800",
      location: "Kumasi, Ghana",
      imageUrl: "https://images.pexels.com/photos/31834232/pexels-photo-31834232.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: true,
      status: "active",
    },
    {
      farmerId: farmers[1].id,
      categoryId: cats[3].id,
      title: "Groundnuts (Peanuts)",
      description: "Dried groundnuts, protein-rich and perfect for cooking, roasting or making groundnut soup.",
      pricePerUnit: "18.00",
      unit: "kg",
      quantityAvailable: "400",
      location: "Tamale, Ghana",
      imageUrl: "https://images.pexels.com/photos/5425893/pexels-photo-5425893.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: true,
      status: "active",
    },
    {
      farmerId: farmers[2].id,
      categoryId: cats[1].id,
      title: "Fresh Avocados (Pear)",
      description: "Creamy Ghanaian pear avocados, ready to eat. Grown naturally without pesticides.",
      pricePerUnit: "5.00",
      unit: "piece",
      quantityAvailable: "600",
      location: "Takoradi, Ghana",
      imageUrl: "https://images.pexels.com/photos/31776842/pexels-photo-31776842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: true,
      status: "active",
    },
    {
      farmerId: farmers[3].id,
      categoryId: cats[4].id,
      title: "Ripe Plantain",
      description: "Sweet ripe plantain perfect for kelewele, tatoke, or fried plantain. Farm fresh.",
      pricePerUnit: "2.50",
      unit: "piece",
      quantityAvailable: "1500",
      location: "Cape Coast, Ghana",
      imageUrl: "https://images.pexels.com/photos/12955498/pexels-photo-12955498.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: true,
      status: "active",
    },
    {
      farmerId: farmers[0].id,
      categoryId: cats[2].id,
      title: "Local Rice",
      description: "Nutritious locally grown Ghanaian rice, minimally processed. Ideal for jollof, waakye or plain rice.",
      pricePerUnit: "12.00",
      unit: "kg",
      quantityAvailable: "1500",
      location: "Kumasi, Ghana",
      imageUrl: "https://images.pexels.com/photos/5425893/pexels-photo-5425893.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: false,
      status: "active",
    },
    {
      farmerId: farmers[2].id,
      categoryId: cats[4].id,
      title: "Yam Tubers",
      description: "Large fresh yam tubers from Takoradi. Perfect for fufu, yam porridge or roasted yam.",
      pricePerUnit: "6.00",
      unit: "kg",
      quantityAvailable: "800",
      location: "Takoradi, Ghana",
      imageUrl: "https://images.pexels.com/photos/31776842/pexels-photo-31776842.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
      organic: false,
      status: "active",
    },
  ]);
  const prods = await db.select().from(products).orderBy(products.id);
  console.log("✅ Products seeded");

  // Market Prices (GHS — Accra market rates)
  await db.insert(marketPrices).values([
    { productName: "Tomatoes", categoryId: cats[0].id, minPrice: "5.00", maxPrice: "12.00", avgPrice: "8.50", unit: "kg", region: "Accra", trend: "up" },
    { productName: "Maize", categoryId: cats[2].id, minPrice: "4.00", maxPrice: "7.00", avgPrice: "5.50", unit: "kg", region: "Accra", trend: "stable" },
    { productName: "Cassava", categoryId: cats[4].id, minPrice: "3.00", maxPrice: "5.50", avgPrice: "4.00", unit: "kg", region: "Accra", trend: "down" },
    { productName: "Mangoes", categoryId: cats[1].id, minPrice: "8.00", maxPrice: "15.00", avgPrice: "11.00", unit: "kg", region: "Accra", trend: "up" },
    { productName: "Kontomire", categoryId: cats[0].id, minPrice: "2.00", maxPrice: "4.00", avgPrice: "3.00", unit: "bunch", region: "Accra", trend: "stable" },
    { productName: "Groundnuts", categoryId: cats[3].id, minPrice: "14.00", maxPrice: "22.00", avgPrice: "18.00", unit: "kg", region: "Accra", trend: "up" },
    { productName: "Avocado (Pear)", categoryId: cats[1].id, minPrice: "3.00", maxPrice: "7.00", avgPrice: "5.00", unit: "piece", region: "Accra", trend: "stable" },
    { productName: "Rice", categoryId: cats[2].id, minPrice: "10.00", maxPrice: "16.00", avgPrice: "12.50", unit: "kg", region: "Accra", trend: "down" },
    { productName: "Onions", categoryId: cats[0].id, minPrice: "5.00", maxPrice: "10.00", avgPrice: "7.50", unit: "kg", region: "Accra", trend: "up" },
    { productName: "Cabbage", categoryId: cats[0].id, minPrice: "4.00", maxPrice: "9.00", avgPrice: "6.50", unit: "head", region: "Accra", trend: "stable" },
    { productName: "Plantain", categoryId: cats[4].id, minPrice: "2.00", maxPrice: "4.00", avgPrice: "2.50", unit: "piece", region: "Accra", trend: "stable" },
    { productName: "Yam", categoryId: cats[4].id, minPrice: "5.00", maxPrice: "9.00", avgPrice: "7.00", unit: "kg", region: "Accra", trend: "up" },
  ]);
  console.log("✅ Market prices seeded");

  // Orders
  await db.insert(orders).values([
    {
      buyerId: buyers[0].id,
      productId: prods[0].id,
      quantity: "50",
      totalPrice: "400.00",
      status: "confirmed",
      deliveryAddress: "Osu, Accra",
    },
    {
      buyerId: buyers[1].id,
      productId: prods[2].id,
      quantity: "100",
      totalPrice: "550.00",
      status: "delivered",
      deliveryAddress: "Adabraka, Kumasi",
    },
    {
      buyerId: buyers[0].id,
      productId: prods[1].id,
      quantity: "30",
      totalPrice: "360.00",
      status: "pending",
      deliveryAddress: "Osu, Accra",
    },
  ]);
  console.log("✅ Orders seeded");

  // Reviews
  await db.insert(reviews).values([
    {
      buyerId: buyers[0].id,
      farmerId: farmers[0].id,
      productId: prods[0].id,
      rating: 5,
      comment: "Excellent tomatoes! Very fresh and well-packaged. Will order again.",
    },
    {
      buyerId: buyers[1].id,
      farmerId: farmers[2].id,
      productId: prods[2].id,
      rating: 4,
      comment: "Good quality maize. Delivered on time. Slight delay but overall happy.",
    },
    {
      buyerId: buyers[0].id,
      farmerId: farmers[1].id,
      productId: prods[1].id,
      rating: 5,
      comment: "Best mangoes I've ever bought! Perfectly ripe and sweet.",
    },
  ]);
  console.log("✅ Reviews seeded");
  console.log("🎉 Database seeding complete!");
}

seed()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await pool.end();
    process.exit(1);
  });
