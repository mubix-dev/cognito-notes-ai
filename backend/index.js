import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

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

