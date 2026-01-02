const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Product = require('../models/Product');
const config = require('../config');

/**
 * Product Seeding Script
 * Adds sample products to the database
 */

const products = [
  // Bracelets (4 products) - braclet1, braclet2, braclet3, braclet4 (note: user's spelling is "braclet")
  {
    name: "Silver Evil Eye Anklet",
    description: "Delicate silver anklet featuring evil eye charms with dark blue outer ring and black center. Includes silver beads and star charm on extender chain.",
    category: "bracelet",
    material: "Silver",
    price: 89,
    originalPrice: 120,
    stock: 15,
    sizes: ["One Size"],
    images: ["/images/braclet1.jpeg"],
    featured: true,
    tags: ["anklet", "evil eye", "silver", "charm"],
    isActive: true
  },
  {
    name: "Silver Beaded Anklet with Star Charm",
    description: "Elegant silver anklet with alternating smooth and textured disc beads, featuring star charms on extender chain.",
    category: "bracelet",
    material: "Silver",
    price: 75,
    stock: 12,
    sizes: ["One Size"],
    images: ["/images/braclet2.jpeg"],
    tags: ["anklet", "beaded", "star charm"],
    isActive: true
  },
  {
    name: "Silver Butterfly Anklet",
    description: "Beautiful silver anklet with detailed butterfly charms, silver beads, and star charms on extender chain.",
    category: "bracelet",
    material: "Silver",
    price: 95,
    stock: 10,
    sizes: ["One Size"],
    images: ["/images/braclet3.jpeg"],
    tags: ["anklet", "butterfly", "charm"],
    isActive: true
  },
  {
    name: "Silver Beaded Anklet with Black Beads",
    description: "Stylish silver anklet with glossy black beads and silver spacer beads, finished with star charm.",
    category: "bracelet",
    material: "Silver",
    price: 79,
    stock: 14,
    sizes: ["One Size"],
    images: ["/images/braclet4.jpeg"],
    tags: ["anklet", "black beads", "silver"],
    isActive: true
  },

  // Earrings (2 products) - er1, er2
  {
    name: "Flower Stud Earrings",
    description: "Delicate five-petal flower stud earrings with marquise-cut stones forming petals and a central round stone. Crafted in gold-toned metal.",
    category: "earrings",
    material: "Gold",
    price: 125,
    stock: 20,
    sizes: [],
    images: ["/images/er1.jpeg"],
    featured: true,
    tags: ["flower", "stud", "gold"],
    isActive: true
  },
  {
    name: "Black Gemstone Stud Earrings",
    description: "Elegant stud earrings featuring faceted black gemstone centers surrounded by sparkling clear stones in gold setting.",
    category: "earrings",
    material: "Gold",
    price: 149,
    stock: 8,
    sizes: [],
    images: ["/images/er2.jpeg"],
    tags: ["stud", "black gem", "pavé"],
    isActive: true
  },

  // Rings (5 products) - Ring1, Ring2, Ring3, Ring4, Ring5 (note: capital R)
  {
    name: "Silver Criss-Cross Ring",
    description: "Modern silver ring with criss-cross band design, one band adorned with sparkling stones and a central stone at intersection.",
    category: "rings",
    material: "Silver",
    price: 139,
    stock: 16,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/Ring1.jpeg"],
    featured: true,
    tags: ["criss-cross", "silver", "modern"],
    isActive: true
  },
  {
    name: "Gold Criss-Cross Ring",
    description: "Elegant gold ring with criss-cross design featuring two bands encrusted with diamonds, creating an X pattern.",
    category: "rings",
    material: "Gold",
    price: 199,
    originalPrice: 249,
    stock: 12,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/Ring2.jpeg"],
    featured: true,
    tags: ["criss-cross", "gold", "diamonds"],
    isActive: true
  },
  {
    name: "Gold Padlock Ring",
    description: "Unique gold ring with padlock charm design, entirely encrusted with sparkling stones and featuring a keyhole detail.",
    category: "rings",
    material: "Gold",
    price: 179,
    stock: 10,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/Ring3.jpeg"],
    tags: ["padlock", "charm", "pavé"],
    isActive: true
  },
  {
    name: "Silver Bow Ring",
    description: "Delicate silver ring with bow design, featuring pavé-set stones on crossing bands and central vertical bar.",
    category: "rings",
    material: "Silver",
    price: 129,
    stock: 14,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/Ring4.jpeg"],
    tags: ["bow", "silver", "pavé"],
    isActive: true
  },
  {
    name: "Gold Double Band Ring",
    description: "Elegant gold ring with two crossing bands - one plain polished gold, one encrusted with diamonds, with central stone.",
    category: "rings",
    material: "Gold",
    price: 189,
    stock: 11,
    sizes: ["6", "7", "8", "9"],
    images: ["/images/Ring5.jpeg"],
    tags: ["double band", "gold", "diamonds"],
    isActive: true
  },

  // Chains/Necklaces (6 products) - chain1, chain2, chain3, chain4, chain5, chain6
  {
    name: "Gold Heart Pendant Necklace",
    description: "Delicate gold chain necklace with pavé-set heart pendant. Features stone-studded chain sections and central curved bar.",
    category: "chains",
    material: "Gold",
    price: 149,
    originalPrice: 199,
    stock: 18,
    sizes: [],
    images: ["/images/chain1.jpeg"],
    featured: true,
    tags: ["heart", "pendant", "pavé"],
    isActive: true
  },
  {
    name: "Silver Heart Pendant Necklace",
    description: "Elegant silver necklace with pavé-set heart pendant. Stone-studded chain sections connect to central curved bar.",
    category: "chains",
    material: "Silver",
    price: 119,
    stock: 22,
    sizes: [],
    images: ["/images/chain2.jpeg"],
    featured: true,
    tags: ["heart", "pendant", "silver"],
    isActive: true
  },
  {
    name: "Gold Butterfly Charm Necklace",
    description: "Delicate gold chain necklace adorned with multiple small butterfly charms, creating a whimsical and elegant design.",
    category: "chains",
    material: "Gold",
    price: 135,
    stock: 15,
    sizes: [],
    images: ["/images/chain3.jpeg"],
    tags: ["butterfly", "charm", "gold"],
    isActive: true
  },
  {
    name: "Star of David Necklace",
    description: "Beautiful silver necklace featuring a Star of David pendant encrusted with sparkling stones and central dark stone detail.",
    category: "chains",
    material: "Silver",
    price: 129,
    stock: 12,
    sizes: [],
    images: ["/images/chain4.jpeg"],
    tags: ["star of david", "pendant", "silver"],
    isActive: true
  },
  {
    name: "Gold Bow Pendant Necklace",
    description: "Elegant gold necklace with bow-shaped pendant encrusted with stones, featuring dangling teardrop gem.",
    category: "chains",
    material: "Gold",
    price: 159,
    stock: 10,
    sizes: [],
    images: ["/images/chain5.jpeg"],
    tags: ["bow", "pendant", "gold"],
    isActive: true
  },
  {
    name: "Gold Interlocking Heart Necklace",
    description: "Unique gold necklace featuring interlocking heart and oval ring pendant design with dangling rectangular stones.",
    category: "chains",
    material: "Gold",
    price: 169,
    stock: 8,
    sizes: [],
    images: ["/images/chain6.jpeg"],
    tags: ["heart", "interlocking", "gold"],
    isActive: true
  }
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

