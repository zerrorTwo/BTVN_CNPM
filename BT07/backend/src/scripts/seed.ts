import sequelize from '../config/database';
import { Category, Product, ProductImage } from '../models';

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
  },
  {
    name: 'Home & Kitchen',
    description: 'Home appliances and kitchen essentials',
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
  },
  {
    name: 'Books & Media',
    description: 'Books, music, and entertainment',
  },
];

const productsByCategory: { [key: string]: any[] } = {
  Electronics: [
    { name: 'Premium Wireless Headphones', price: 299.99, brand: 'SoundTech', stock: 50, description: 'High-quality wireless headphones with noise cancellation' },
    { name: 'Smartphone Pro Max', price: 1299.99, brand: 'TechGiant', stock: 30, description: 'Latest flagship smartphone with advanced features' },
    { name: 'Laptop Ultra Slim', price: 1899.99, brand: 'CompuPro', stock: 20, description: 'Lightweight laptop with powerful performance' },
    { name: 'Smart Watch Series X', price: 499.99, brand: 'WearTech', stock: 45, description: 'Advanced smartwatch with health tracking features' },
    { name: 'Wireless Earbuds', price: 199.99, brand: 'AudioMax', stock: 100, description: 'Compact wireless earbuds with premium sound' },
    { name: '4K Smart TV 55"', price: 899.99, brand: 'ViewTech', stock: 15, description: 'Ultra HD smart TV with HDR support' },
    { name: 'Gaming Console Next Gen', price: 599.99, brand: 'GameBox', stock: 25, description: 'Next generation gaming console with 4K support' },
    { name: 'Tablet Pro 12.9"', price: 1099.99, brand: 'TabletCo', stock: 35, description: 'Professional tablet with stylus support' },
    { name: 'Digital Camera DSLR', price: 1499.99, brand: 'PhotoPro', stock: 12, description: 'Professional DSLR camera with 4K video' },
    { name: 'Bluetooth Speaker', price: 149.99, brand: 'SoundWave', stock: 80, description: 'Portable bluetooth speaker with powerful bass' },
  ],
  Clothing: [
    { name: 'Classic Denim Jeans', price: 79.99, brand: 'DenimCo', stock: 120, description: 'Comfortable and durable denim jeans' },
    { name: 'Cotton T-Shirt Pack', price: 29.99, brand: 'BasicWear', stock: 200, description: 'Pack of 3 premium cotton t-shirts' },
    { name: 'Winter Jacket', price: 159.99, brand: 'WarmTech', stock: 60, description: 'Insulated winter jacket for cold weather' },
    { name: 'Running Shoes', price: 119.99, brand: 'SportFit', stock: 75, description: 'Lightweight running shoes with cushioned sole' },
    { name: 'Formal Dress Shirt', price: 69.99, brand: 'ClassicStyle', stock: 90, description: 'Professional dress shirt for office wear' },
    { name: 'Yoga Pants', price: 49.99, brand: 'FlexWear', stock: 110, description: 'Stretchy and comfortable yoga pants' },
    { name: 'Leather Belt', price: 39.99, brand: 'LuxLeather', stock: 85, description: 'Genuine leather belt with metal buckle' },
    { name: 'Summer Dress', price: 89.99, brand: 'TrendyFash', stock: 70, description: 'Light and breezy summer dress' },
    { name: 'Sports Cap', price: 24.99, brand: 'CapMaster', stock: 150, description: 'Adjustable sports cap with UV protection' },
    { name: 'Wool Scarf', price: 34.99, brand: 'CozyWear', stock: 95, description: 'Soft wool scarf for winter' },
  ],
  'Home & Kitchen': [
    { name: 'Coffee Maker Deluxe', price: 129.99, brand: 'BrewMaster', stock: 40, description: 'Programmable coffee maker with timer' },
    { name: 'Blender Pro 1000W', price: 89.99, brand: 'MixTech', stock: 55, description: 'Powerful blender for smoothies and more' },
    { name: 'Air Fryer XL', price: 159.99, brand: 'HealthyCook', stock: 35, description: 'Large capacity air fryer for healthy cooking' },
    { name: 'Vacuum Cleaner Robot', price: 399.99, brand: 'CleanBot', stock: 20, description: 'Smart robot vacuum with app control' },
    { name: 'Non-Stick Cookware Set', price: 199.99, brand: 'ChefPro', stock: 45, description: '10-piece non-stick cookware set' },
    { name: 'Electric Kettle', price: 49.99, brand: 'BoilFast', stock: 70, description: 'Fast-boiling electric kettle with auto shut-off' },
    { name: 'Food Processor', price: 179.99, brand: 'ChopMaster', stock: 30, description: 'Multi-function food processor' },
    { name: 'Toaster Oven', price: 109.99, brand: 'ToastPro', stock: 42, description: 'Countertop toaster oven with convection' },
    { name: 'Stand Mixer', price: 299.99, brand: 'BakeMaster', stock: 25, description: 'Professional stand mixer for baking' },
    { name: 'Dish Rack Stainless Steel', price: 39.99, brand: 'KitchenOrg', stock: 65, description: 'Rust-proof dish drying rack' },
  ],
  'Sports & Outdoors': [
    { name: 'Camping Tent 4-Person', price: 249.99, brand: 'OutdoorPro', stock: 28, description: 'Waterproof camping tent for 4 people' },
    { name: 'Hiking Backpack 50L', price: 129.99, brand: 'TrailBlazer', stock: 40, description: 'Durable hiking backpack with rain cover' },
    { name: 'Sleeping Bag Winter', price: 89.99, brand: 'CozyCamp', stock: 35, description: 'Insulated sleeping bag for cold weather' },
    { name: 'Portable Camping Stove', price: 59.99, brand: 'CookOutdoor', stock: 50, description: 'Compact camping stove with fuel canister' },
    { name: 'Trekking Poles Pair', price: 44.99, brand: 'HikeEasy', stock: 60, description: 'Adjustable aluminum trekking poles' },
    { name: 'Yoga Mat Premium', price: 39.99, brand: 'ZenFit', stock: 90, description: 'Extra thick yoga mat with carrying strap' },
    { name: 'Mountain Bike 27.5"', price: 799.99, brand: 'RidePro', stock: 15, description: 'Full suspension mountain bike' },
    { name: 'Fishing Rod Combo', price: 149.99, brand: 'CatchMaster', stock: 32, description: 'Complete fishing rod and reel combo' },
    { name: 'Sports Water Bottle', price: 19.99, brand: 'HydroFlow', stock: 120, description: 'Insulated water bottle keeps drinks cold' },
    { name: 'Resistance Bands Set', price: 29.99, brand: 'FitStrong', stock: 85, description: 'Set of 5 resistance bands with handles' },
  ],
  'Books & Media': [
    { name: 'Best Seller Fiction Novel', price: 24.99, brand: 'ReadWell', stock: 100, description: 'Award-winning fiction bestseller' },
    { name: 'Cooking Masterclass Book', price: 34.99, brand: 'ChefGuide', stock: 75, description: 'Comprehensive cooking guide with recipes' },
    { name: 'Business Strategy Guide', price: 39.99, brand: 'SuccessBooks', stock: 60, description: 'Modern business strategy handbook' },
    { name: 'Photography Tutorial DVD', price: 29.99, brand: 'LearnPhoto', stock: 45, description: 'Complete photography course on DVD' },
    { name: 'Fitness Training eBook', price: 19.99, brand: 'FitGuide', stock: 200, description: 'Digital fitness and nutrition guide' },
    { name: 'Classical Music Collection', price: 49.99, brand: 'ClassicSound', stock: 55, description: 'Box set of classical music CDs' },
    { name: 'Travel Photography Book', price: 44.99, brand: 'WorldViews', stock: 40, description: 'Stunning travel photography collection' },
    { name: 'Mindfulness & Meditation', price: 27.99, brand: 'PeacePress', stock: 70, description: 'Guide to mindfulness and meditation' },
    { name: 'Programming Fundamentals', price: 54.99, brand: 'CodeMaster', stock: 80, description: 'Comprehensive programming textbook' },
    { name: 'Vinyl Record Player', price: 249.99, brand: 'RetroSound', stock: 22, description: 'Vintage-style vinyl record player' },
  ],
};

const imageUrls = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
  'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500',
  'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized (all data cleared)');

    console.log('\n📦 Creating categories...');
    const createdCategories = await Category.bulkCreate(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    console.log('\n📦 Creating products and images...');
    let totalProducts = 0;
    let totalImages = 0;

    for (const category of createdCategories) {
      const categoryProducts = productsByCategory[category.name];
      
      for (const productData of categoryProducts) {
        const product = await Product.create({
          ...productData,
          categoryId: category.id,
        });
        totalProducts++;

        const numImages = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numImages; i++) {
          await ProductImage.create({
            productId: product.id,
            imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
            isPrimary: i === 0,
            displayOrder: i,
          });
          totalImages++;
        }
      }
      
      console.log(`  ✓ ${category.name}: 10 products created`);
    }

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${totalProducts}`);
    console.log(`   - Product Images: ${totalImages}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
