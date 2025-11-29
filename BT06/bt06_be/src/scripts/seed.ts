import "reflect-metadata";
import { sequelize, testConnection } from "../config/database";
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/product.service";
import "../models"; // Import models to register them

const SEED_DATA = [
  {
    name: "Điện Thoại & Tablet",
    slug: "dien-thoai-tablet",
    description: "Smartphone và máy tính bảng công nghệ mới nhất.",
    products: [
      { name: "iPhone 15 Pro Max Titan", price: 34990000, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80" },
      { name: "Samsung Galaxy S24 Ultra", price: 31990000, img: "https://images.unsplash.com/photo-1705697775685-304e9c70014a?w=600&q=80" },
      { name: "Google Pixel 8 Pro", price: 20990000, img: "https://images.unsplash.com/photo-1696320579178-53e343468087?w=600&q=80" },
      { name: "iPad Pro M4 13 inch", price: 37990000, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80" },
      { name: "Xiaomi 14 Ultra", price: 29990000, img: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=600&q=80" },
      { name: "Samsung Galaxy Z Flip 5", price: 19990000, img: "https://images.unsplash.com/photo-1692809188056-b8a74b0254c0?w=600&q=80" },
      { name: "OPPO Find N3", price: 41990000, img: "https://images.unsplash.com/photo-1678859663953-f421df7e5979?w=600&q=80" },
      { name: "Sony Xperia 1 V", price: 27990000, img: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=600&q=80" },
      { name: "Asus ROG Phone 8", price: 24990000, img: "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=600&q=80" },
      { name: "iPad Mini 6", price: 12990000, img: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&q=80" }
    ]
  },
  {
    name: "Thời Trang Nam",
    slug: "thoi-trang-nam",
    description: "Quần áo, phụ kiện thời trang phong cách.",
    products: [
      { name: "Áo Thun Basic White Tee", price: 250000, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
      { name: "Áo Hoodie Streetwear Black", price: 650000, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80" },
      { name: "Quần Jeans Levi's 501", price: 1200000, img: "https://images.unsplash.com/photo-1542272617-08f086303294?w=600&q=80" },
      { name: "Áo Khoác Denim Jacket", price: 890000, img: "https://images.unsplash.com/photo-1516257984-b1b4d8c92306?w=600&q=80" },
      { name: "Giày Sneaker Nike Air Jordan", price: 3500000, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80" },
      { name: "Áo Sơ Mi Oxford Blue", price: 450000, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
      { name: "Kính Mát Rayban Wayfarer", price: 2100000, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80" },
      { name: "Ví Da Nam Handmade", price: 550000, img: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=600&q=80" },
      { name: "Thắt Lưng Da Bò Sáp", price: 350000, img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80" },
      { name: "Giày Chelsea Boots Da Lộn", price: 1500000, img: "https://images.unsplash.com/photo-1638367980315-779836585124?w=600&q=80" }
    ]
  },
  {
    name: "Đồng Hồ Chính Hãng",
    slug: "dong-ho",
    description: "Đồng hồ cơ, đồng hồ thông minh cao cấp.",
    products: [
      { name: "Apple Watch Ultra 2 Dây Cam", price: 21990000, img: "https://images.unsplash.com/photo-1664478546384-d57ffe74a797?w=600&q=80" },
      { name: "Rolex Submariner (Replica)", price: 15000000, img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80" },
      { name: "Seiko 5 Automatic Sport", price: 6800000, img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80" },
      { name: "Casio G-Shock GA-2100", price: 3200000, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80" },
      { name: "Daniel Wellington Classic", price: 4200000, img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80" },
      { name: "Orient Bambino Gen 4", price: 5500000, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80" },
      { name: "Tissot PRX Powermatic 80", price: 18500000, img: "https://images.unsplash.com/photo-1619946460980-0a8a65893b82?w=600&q=80" },
      { name: "Citizen Eco-Drive Titanium", price: 9800000, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80" },
      { name: "Huawei Watch GT 4", price: 5490000, img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80" },
      { name: "Đồng hồ treo tường cổ điển", price: 1200000, img: "https://images.unsplash.com/photo-1563861826100-9cb868c656d9?w=600&q=80" }
    ]
  },
  {
    name: "Nội Thất & Decor",
    slug: "noi-that-decor",
    description: "Trang trí nhà cửa phong cách Minimalism.",
    products: [
      { name: "Sofa Ghế Đơn Minimalist", price: 4500000, img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80" },
      { name: "Đèn Ngủ Để Bàn Gỗ", price: 850000, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
      { name: "Cây Xương Rồng Decor", price: 350000, img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80" },
      { name: "Bàn Làm Việc Gỗ Sồi", price: 3200000, img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80" },
      { name: "Kệ Sách Treo Tường", price: 1200000, img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80" },
      { name: "Gương Tròn Dây Da", price: 900000, img: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80" },
      { name: "Thảm Trải Sàn Lông Cừu", price: 1500000, img: "https://images.unsplash.com/photo-1575414003502-94236ecdd868?w=600&q=80" },
      { name: "Ghế Eames Chân Gỗ", price: 650000, img: "https://images.unsplash.com/photo-1503602642458-23211144584b?w=600&q=80" },
      { name: "Bình Hoa Gốm Sứ", price: 450000, img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80" },
      { name: "Nến Thơm Phòng Relax", price: 250000, img: "https://images.unsplash.com/photo-1602826646960-b615b3992b42?w=600&q=80" }
    ]
  },
  {
    name: "Sách Hay Nên Đọc",
    slug: "sach-hay",
    description: "Sách văn học, kinh tế và phát triển bản thân.",
    products: [
      { name: "Nhà Giả Kim (The Alchemist)", price: 79000, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80" },
      { name: "Đắc Nhân Tâm", price: 86000, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80" },
      { name: "Harry Potter Trọn Bộ", price: 1850000, img: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=600&q=80" },
      { name: "Sapiens: Lược Sử Loài Người", price: 185000, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80" },
      { name: "Lối Sống Tối Giản", price: 96000, img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80" },
      { name: "Cà Phê Cùng Tony", price: 80000, img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80" },
      { name: "Sherlock Holmes Toàn Tập", price: 250000, img: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&q=80" },
      { name: "Tuổi Trẻ Đáng Giá Bao Nhiêu", price: 85000, img: "https://images.unsplash.com/photo-1554672723-d2fd5351de36?w=600&q=80" },
      { name: "Dạy Con Làm Giàu", price: 110000, img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80" },
      { name: "Rừng Na Uy", price: 130000, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80" }
    ]
  }
];

const seed = async () => {
  try {
    console.log("Starting seed...");
    await testConnection();
    await sequelize.sync({ alter: true });

    const categoryService = new CategoryService();
    const productService = new ProductService();

    // Create Categories
    console.log("Seeding categories...");
    const categories: any[] = [];
    // Create categories and their products from SEED_DATA
    for (const catData of SEED_DATA) {
        try {
            const category = await categoryService.createCategory({
                name: catData.name,
                description: catData.description,
                slug: catData.slug,
            });
            categories.push(category);
            console.log(`Created category: ${category.name}`);
            // Create products for this category
            if (catData.products && Array.isArray(catData.products)) {
                for (const prod of catData.products) {
                    try {
                        await productService.createProduct({
                            name: prod.name,
                            description: (prod as any).description ?? `Mô tả cho ${prod.name}`,
                            price: prod.price,
                            stock: (prod as any).stock ?? Math.floor(Math.random() * 100) + 1,
                            imageUrl: prod.img,
                            categoryId: category.id,
                        });
                        console.log(`Created product: ${prod.name}`);
                    } catch (e: any) {
                        console.error(`Failed product ${prod.name}:`, e.message);
                    }
                }
            }
        } catch (e: any) {
            console.error(`Failed category ${catData.name}:`, e.message);
        }
    }

    if (categories.length === 0) {
        // Try to fetch existing categories if creation failed (maybe they already exist?)
        // But since we used unique slugs, they should be created unless DB error.
        // Let's just fetch all categories to be safe for product seeding
        const allCategories = await categoryService.getAllCategories();
        if (allCategories.length > 0) {
             categories.push(...allCategories);
        } else {
             console.error("No categories available. Aborting product seed.");
             process.exit(1);
        }
    }

    // Product creation is handled within the category loop above using SEED_DATA

    // Initialize Elasticsearch
    console.log("Initializing Elasticsearch...");
    const { SearchService } = await import("../services/search.service");
    const searchService = new SearchService();
    
    try {
      await searchService.createIndex();
      console.log("Elasticsearch index created");
      
      await searchService.syncProducts();
      console.log("Products synced to Elasticsearch");
    } catch (error) {
      console.error("Elasticsearch initialization failed:", error);
      console.log("Continuing without Elasticsearch...");
    }

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
