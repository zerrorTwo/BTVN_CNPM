import sequelize from "../config/database";
import { User, Category, Product, ProductImage } from "../models";

async function seedDemoUser() {
  try {
    await sequelize.sync({ alter: true });

    // Create demo user
    const [user] = await User.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        email: "demo@example.com",
        // Add other required fields based on User model
      },
    });

    console.log("✅ Demo user created:", user.id);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo user:", error);
    process.exit(1);
  }
}

seedDemoUser();
