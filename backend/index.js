import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import notesRoutes from "./src/routes/notes.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import { stripeWebhook } from "./src/controllers/payment.controller.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running..." });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

connectDB()
.then(()=>{
    app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
})
.catch((error)=>{
    console.log("MongoDB connection error!", error)
    process.exit(1)
})

