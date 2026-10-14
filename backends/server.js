import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

connectDB();

// Static uploads (fallback for local development)
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads/images"));
app.use("/images", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);

app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});