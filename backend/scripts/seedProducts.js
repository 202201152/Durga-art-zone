const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Product = require('../models/Product');
const config = require('../config');

/**
 * Product Seeding Script
 * Adds sample products to the database using available images
 */

const products = [
  // ================= BRACELETS (10 items) =================
  {
    name: "Gold Leaf Charm Bracelet",
    description: "Delicate gold-toned bracelet featuring intricate leaf charms interspersed with small beads. Perfect for stacking or wearing alone.",
    category: "bracelet",
    material: "Gold",
    price: 189,
    originalPrice: 250,
    stock: 15,
    images: ["/images/bracelet-gold-01.jpg.jpeg"],
    tags: ["bracelet", "gold", "charm", "leaf"],
    status: "active",
    isFeatured: true
  },
  {
    name: "Gold Beaded Chain Bracelet",
    description: "Classic gold beaded bracelet with a durable chain. A timeless piece suitable for daily wear.",
    category: "bracelet",
    material: "Gold",
    price: 150,
    originalPrice: 200,
    stock: 20,
    images: ["/images/bracelet-gold-02.jpg.jpeg"],
    tags: ["bracelet", "gold", "beaded"],
    status: "active"
  },
  {
    name: "Gold Butterfly Link Bracelet",
    description: "Elegant bracelet featuring butterfly-shaped links connected by a fine chain. Adds a touch of whimsy to any outfit.",
    category: "bracelet",
    material: "Gold",
    price: 195,
    originalPrice: 260,
    stock: 12,
    images: ["/images/bracelet-gold-03.jpg.jpeg"],
    tags: ["bracelet", "gold", "butterfly"],
    status: "active"
  },
  {
    name: "Gold Heart Charm Anklet",
    description: "Romantic gold-toned anklet with heart charms. Adjustable length for a comfortable fit.",
    category: "bracelet",
    material: "Gold",
    price: 210,
    originalPrice: 280,
    stock: 18,
    images: ["/images/bracelet-gold-04.jpg.jpeg"],
    tags: ["anklet", "gold", "heart"],
    status: "active"
  },
  {
    name: "Gold Star Dust Bracelet",
    description: "Shimmering bracelet with star-shaped accents and a textured finish that catches the light beautifully.",
    category: "bracelet",
    material: "Gold",
    price: 225,
    stock: 10,
    images: ["/images/bracelet-gold-05.jpg.jpeg"],
    tags: ["bracelet", "gold", "star"],
    status: "active"
  },
  {
    name: "Gold Infinity Link Bracelet",
    description: "Symbolize forever with this infinity link bracelet. Crafted in high-quality gold tone material.",
    category: "bracelet",
    material: "Gold",
    price: 175,
    stock: 25,
    images: ["/images/bracelet-gold-06.jpg.jpeg"],
    tags: ["bracelet", "gold", "infinity"],
    status: "active"
  },
  {
    name: "Gold Coin Charm Bracelet",
    description: "Bohemian style bracelet featuring dangling coin charms. Adds movement and style to your wrist stack.",
    category: "bracelet",
    material: "Gold",
    price: 199,
    originalPrice: 240,
    stock: 14,
    images: ["/images/bracelet-gold-07.jpg.jpeg"],
    tags: ["bracelet", "gold", "coin", "boho"],
    status: "active"
  },
  {
    name: "Gold Pearl Accent Bracelet",
    description: "Sophisticated bracelet combining gold links with lustrous faux pearl accents through the chain.",
    category: "bracelet",
    material: "Gold",
    price: 245,
    stock: 8,
    images: ["/images/bracelet-gold-08.jpg.jpeg"],
    tags: ["bracelet", "gold", "pearl"],
    status: "active"
  },
  {
    name: "Gold Geometric Cuff",
    description: "Modern open cuff design with geometric shapes. Minimalist and chic.",
    category: "bracelet",
    material: "Gold",
    price: 160,
    stock: 22,
    images: ["/images/bracelet-gold-09.jpg.jpeg"],
    tags: ["cuff", "gold", "geometric", "minimalist"],
    status: "active"
  },
  {
    name: "Gold Multi-Layer Bracelet",
    description: "Get the stacked look with one piece. Features multiple delicate chains layered together.",
    category: "bracelet",
    material: "Gold",
    price: 280,
    originalPrice: 350,
    stock: 5,
    images: ["/images/bracelet-gold-10.jpg.jpeg"],
    tags: ["bracelet", "gold", "layered"],
    status: "active",
    isFeatured: true
  },

  // ================= EARRINGS (2 items) =================
  {
    name: "Gold Flower Studs",
    description: "Delicate flower stud earrings with crystal centers. Perfect for everyday elegance.",
    category: "earrings",
    material: "Gold",
    price: 120,
    stock: 30,
    images: ["/images/earring-gold-01.jpg.jpeg"],
    tags: ["earrings", "studs", "flower", "gold"],
    status: "active"
  },
  {
    name: "Gold Teardrop Hoops",
    description: "Classic teardrop-shaped hoop earrings. Lightweight and versatile.",
    category: "earrings",
    material: "Gold",
    price: 145,
    stock: 25,
    images: ["/images/earring-gold-02.jpg.jpeg"],
    tags: ["earrings", "hoops", "gold"],
    status: "active"
  },

  // ================= RINGS (6 items) =================
  {
    name: "Gold Criss-Cross Ring",
    description: "Modern criss-cross band design adorned with small crystals.",
    category: "rings",
    material: "Gold",
    price: 180,
    stock: 15,
    sizes: ["6", "7", "8"],
    images: ["/images/ring-gold-01.jpg.jpeg"],
    tags: ["ring", "gold", "criss-cross"],
    status: "active"
  },
  {
    name: "Gold Infinity Ring",
    description: "Elegant ring featuring the infinity symbol, representing eternal love.",
    category: "rings",
    material: "Gold",
    price: 165,
    stock: 18,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/ring-gold-02.jpg.jpeg"],
    tags: ["ring", "gold", "infinity"],
    status: "active"
  },
  {
    name: "Gold Heart Promise Ring",
    description: "Sweet and simple heart-shaped ring, perfect as a promise ring or gift.",
    category: "rings",
    material: "Gold",
    price: 150,
    stock: 20,
    sizes: ["5", "6", "7", "8"],
    images: ["/images/ring-gold-03.jpg.jpeg"],
    tags: ["ring", "gold", "heart"],
    status: "active"
  },
  {
    name: "Gold Solitaire Ring",
    description: "Classic solitaire ring featuring a high-quality cubic zirconia stone.",
    category: "rings",
    material: "Gold",
    price: 220,
    originalPrice: 299,
    stock: 10,
    sizes: ["6", "7", "8"],
    images: ["/images/ring-gold-04.jpg.jpeg"],
    tags: ["ring", "gold", "solitaire"],
    status: "active"
  },
  {
    name: "Gold Texture Band Ring",
    description: "Wide band ring with a unique hammered texture finish.",
    category: "rings",
    material: "Gold",
    price: 195,
    stock: 12,
    sizes: ["7", "8", "9"],
    images: ["/images/ring-gold-05.jpg.jpeg"],
    tags: ["ring", "gold", "textured"],
    status: "active"
  },
  {
    name: "Gold Twist Ring",
    description: "Delicate twisted band design, simple yet sophisticated.",
    category: "rings",
    material: "Gold",
    price: 140,
    stock: 22,
    sizes: ["6", "7", "8"],
    images: ["/images/ring-gold-06.jpg.jpeg"],
    tags: ["ring", "gold", "twist"],
    status: "active"
  },

  // ================= CHAINS/NECKLACES (10 items) =================
  {
    name: "Gold Link Chain",
    description: "Classic gold link chain, sturdy and stylish. Wear it alone or with a pendant.",
    category: "chains",
    material: "Gold",
    price: 350,
    originalPrice: 450,
    stock: 15,
    sizes: ["18", "20", "22"],
    images: ["/images/necklace-gold-01.jpg.jpeg"],
    tags: ["chain", "gold", "link"],
    status: "active",
    isFeatured: true
  },
  {
    name: "Gold Rope Chain",
    description: "Intricate rope chain design that offers a luxurious look.",
    category: "chains",
    material: "Gold",
    price: 380,
    stock: 12,
    sizes: ["18", "20", "24"],
    images: ["/images/necklace-gold-02.jpg.jpeg"],
    tags: ["chain", "gold", "rope"],
    status: "active"
  },
  {
    name: "Gold Box Chain",
    description: "Sleek box chain with square links, offering a modern geometric look.",
    category: "chains",
    material: "Gold",
    price: 320,
    stock: 20,
    sizes: ["18", "20", "22"],
    images: ["/images/necklace-gold-03.jpg.jpeg"],
    tags: ["chain", "gold", "box"],
    status: "active"
  },
  {
    name: "Gold Snake Chain",
    description: "Smooth and flexible snake chain, perfect for a liquid gold effect.",
    category: "chains",
    material: "Gold",
    price: 290,
    stock: 18,
    sizes: ["16", "18", "20"],
    images: ["/images/necklace-gold-04.jpg.jpeg"],
    tags: ["chain", "gold", "snake"],
    status: "active"
  },
  {
    name: "Gold Figaro Chain",
    description: "Traditional Figaro chain with alternating link sizes.",
    category: "chains",
    material: "Gold",
    price: 360,
    stock: 10,
    sizes: ["20", "22", "24"],
    images: ["/images/necklace-gold-05.jpg.jpeg"],
    tags: ["chain", "gold", "figaro"],
    status: "active"
  },
  {
    name: "Gold Curb Chain",
    description: "Flat curb chain design that sits comfortably against the skin.",
    category: "chains",
    material: "Gold",
    price: 340,
    stock: 15,
    sizes: ["18", "20"],
    images: ["/images/necklace-gold-06.jpg.jpeg"],
    tags: ["chain", "gold", "curb"],
    status: "active"
  },
  {
    name: "Gold Singapore Chain",
    description: "twisted Singapore chain that sparkles as it moves.",
    category: "chains",
    material: "Gold",
    price: 310,
    stock: 14,
    sizes: ["16", "18"],
    images: ["/images/necklace-gold-07.jpg.jpeg"],
    tags: ["chain", "gold", "singapore"],
    status: "active"
  },
  {
    name: "Gold Wheat Chain",
    description: "Intricate wheat chain design, durable and beautiful.",
    category: "chains",
    material: "Gold",
    price: 390,
    originalPrice: 500,
    stock: 8,
    sizes: ["20", "22", "24"],
    images: ["/images/necklace-gold-08.jpg.jpeg"],
    tags: ["chain", "gold", "wheat"],
    status: "active"
  },
  {
    name: "Gold Bead Chain",
    description: "Chain composed of small gold beads for a textured look.",
    category: "chains",
    material: "Gold",
    price: 275,
    stock: 20,
    sizes: ["16", "18"],
    images: ["/images/necklace-gold-09.jpg.jpeg"],
    tags: ["chain", "gold", "bead"],
    status: "active"
  },
  {
    name: "Gold Herringbone Chain",
    description: "Flat herringbone chain that lays perfectly flat on the neck.",
    category: "chains",
    material: "Gold",
    price: 400,
    stock: 6,
    sizes: ["16", "18"],
    images: ["/images/necklace-gold-10.jpg.jpeg"],
    tags: ["chain", "gold", "herringbone"],
    status: "active",
    isFeatured: true
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

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
