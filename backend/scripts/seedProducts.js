const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Product = require('../models/Product');
const config = require('../config');

/**
 * Product Seeding Script
 * Adds sample products to the database
 */

const products = [
  // Bracelets (4 products)
  {
    name: "Silver Evil Eye Anklet",
    description: "Delicate silver anklet featuring evil eye charms with dark blue outer ring and black center. Includes silver beads and star charm on extender chain.",
    category: "bracelet",
    material: "Silver",
    price: 89,
    originalPrice: 120,
    stock: 15,
    sizes: ["One Size"],
    images: ["/images/bracelet-gold-01.jpg.jpeg"],
    isFeatured: true,
    tags: ["anklet", "evil eye", "silver", "charm"],
    status: "active"
  },
  {
    name: "Silver Beaded Anklet with Star Charm",
    description: "Elegant silver anklet with alternating smooth and textured disc beads, featuring star charms on extender chain.",
    category: "bracelet",
    material: "Silver",
    price: 75,
    originalPrice: 100,
    stock: 12,
    sizes: ["One Size"],
    images: ["/images/bracelet-gold-02.jpg.jpeg"],
    tags: ["anklet", "beaded", "star charm"],
    status: "active"
  },
  {
    name: "Silver Butterfly Anklet",
    description: "Beautiful silver anklet with detailed butterfly charms, silver beads, and star charms on extender chain.",
    category: "bracelet",
    material: "Silver",
    price: 95,
    originalPrice: 130,
    stock: 10,
    sizes: ["One Size"],
    images: ["/images/bracelet-gold-03.jpg.jpeg"],
    tags: ["anklet", "butterfly", "charm"],
    status: "active"
  },
  {
    name: "Silver Heart Charm Anklet",
    description: "Romantic silver anklet with heart charms, silver beads, and delicate chain extender.",
    category: "bracelet",
    material: "Silver",
    price: 110,
    originalPrice: 150,
    stock: 8,
    sizes: ["One Size"],
    images: ["/images/bracelet-gold-04.jpg.jpeg"],
    tags: ["anklet", "heart", "charm"],
    status: "active"
  },

  // Earrings (2 products)
  {
    name: "Flower Stud Earrings",
    description: "Delicate five-petal flower stud earrings with marquise-cut stones forming petals and a central round stone. Crafted in gold-toned metal.",
    category: "earrings",
    material: "Gold",
    price: 125,
    originalPrice: 180,
    stock: 20,
    sizes: ["One Size"],
    images: ["/images/earring-gold-01.jpg.jpeg"],
    tags: ["stud", "flower", "marquise"],
    status: "active"
  },
  {
    name: "Teardrop Hoop Earrings",
    description: "Elegant teardrop-shaped hoop earrings with delicate filigree details and secure latch closure. Gold-toned finish.",
    category: "earrings",
    material: "Gold",
    price: 150,
    originalPrice: 200,
    stock: 15,
    sizes: ["One Size"],
    images: ["/images/earring-gold-02.jpg.jpeg"],
    tags: ["hoop", "teardrop", "filigree"],
    status: "active"
  },

  // Rings (5 products)
  {
    name: "Silver Criss-Cross Ring",
    description: "Modern silver ring with criss-cross band design, one band adorned with sparkling stones and a central stone at intersection.",
    category: "rings",
    material: "Silver",
    price: 139,
    originalPrice: 180,
    stock: 11,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/ring-gold-01.jpg.jpeg"],
    tags: ["criss-cross", "stones", "modern"],
    status: "active"
  },
  {
    name: "Gold Infinity Ring",
    description: "Elegant gold ring featuring infinity symbol design with small diamonds set along the curve, polished band.",
    category: "rings",
    material: "Gold",
    price: 249,
    originalPrice: 320,
    stock: 8,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/ring-gold-02.jpg.jpeg"],
    tags: ["infinity", "diamonds", "elegant"],
    status: "active"
  },
  {
    name: "Silver Heart Promise Ring",
    description: "Romantic silver promise ring with heart-shaped setting, small accent stone, and polished band finish.",
    category: "rings",
    material: "Silver",
    price: 89,
    originalPrice: 120,
    stock: 15,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/ring-gold-03.jpg.jpeg"],
    tags: ["promise ring", "heart", "romantic"],
    status: "active"
  },
  {
    name: "Gold Diamond Solitaire Ring",
    description: "Classic gold solitaire ring with single brilliant-cut diamond in four-prong setting, timeless design.",
    category: "rings",
    material: "Gold",
    price: 499,
    originalPrice: 650,
    stock: 5,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/ring-gold-04.jpg.jpeg"],
    tags: ["solitaire", "diamond", "classic"],
    status: "active"
  },
  {
    name: "Silver Double Band Ring",
    description: "Contemporary silver ring with double band design, textured finish, and modern aesthetic.",
    category: "rings",
    material: "Silver",
    price: 189,
    stock: 11,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/ring-gold-05.jpg.jpeg"],
    tags: ["double band", "textured", "modern"],
    status: "active"
  },

  // Chains/Necklaces (6 products)
  {
    name: "Silver Link Chain Necklace",
    description: "Classic silver link chain with alternating polished and textured links, adjustable length with lobster clasp.",
    category: "chains",
    material: "Silver",
    price: 199,
    originalPrice: 250,
    stock: 25,
    sizes: ["16", "18", "20"],
    images: ["/images/chain1.jpeg"],
    tags: ["link chain", "classic", "adjustable"],
    status: "active"
  },
  {
    name: "Silver Rope Chain",
    description: "Delicate silver rope chain with twisted design, lightweight and comfortable for everyday wear.",
    category: "chains",
    material: "Silver",
    price: 159,
    originalPrice: 200,
    stock: 30,
    sizes: ["16", "18", "20"],
    images: ["/images/chain2.jpeg"],
    tags: ["rope chain", "twisted", "lightweight"],
    status: "active"
  },
  {
    name: "Gold Box Chain Necklace",
    description: "Elegant gold box chain with square links, substantial weight for premium feel, secure spring ring clasp.",
    category: "chains",
    material: "Gold",
    price: 299,
    originalPrice: 380,
    stock: 15,
    sizes: ["16", "18", "20"],
    images: ["/images/chain3.jpeg"],
    tags: ["box chain", "substantial", "premium"],
    status: "active"
  },
  {
    name: "Silver Cable Chain",
    description: "Modern silver cable chain with oval links, minimalist design perfect for pendants and layering.",
    category: "chains",
    material: "Silver",
    price: 179,
    originalPrice: 220,
    stock: 20,
    sizes: ["16", "18", "20"],
    images: ["/images/chain4.jpeg"],
    tags: ["cable chain", "modern", "minimalist"],
    status: "active"
  },
  {
    name: "Gold Figaro Chain",
    description: "Traditional gold Figaro chain with alternating pattern of one long link followed by three short links, polished finish.",
    category: "chains",
    material: "Gold",
    price: 349,
    originalPrice: 450,
    stock: 12,
    sizes: ["16", "18", "20"],
    images: ["/images/chain5.jpeg"],
    tags: ["Figaro", "traditional", "polished"],
    status: "active"
  },
  {
    name: "Silver Snake Chain",
    description: "Flexible silver snake chain with smooth, rounded links that create a fluid, liquid-like appearance when worn.",
    category: "chains",
    material: "Silver",
    price: 219,
    originalPrice: 280,
    stock: 18,
    sizes: ["16", "18", "20"],
    images: ["/images/chain6.jpeg"],
    tags: ["snake chain", "flexible", "smooth"],
    status: "active"
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB Connected');

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Display summary
    const categories = {};
    createdProducts.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });

    console.log('\n📊 Product Summary:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();

