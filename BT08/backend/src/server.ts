import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
      console.log(`\nAvailable endpoints:`);
      console.log(`  GET    /api/products`);
      console.log(`  GET    /api/products/:id`);
      console.log(`  GET    /api/products/:id/similar`);
      console.log(`  GET    /api/favorites?userId=:userId`);
      console.log(`  POST   /api/favorites`);
      console.log(`  DELETE /api/favorites/:userId/:productId`);
      console.log(`  GET    /api/comments?productId=:productId`);
      console.log(`  POST   /api/comments`);
      console.log(`  PUT    /api/comments/:id`);
      console.log(`  DELETE /api/comments/:id`);
      console.log(`  GET    /api/product-views?userId=:userId`);
      console.log(`  POST   /api/product-views`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
  }
}

startServer();
