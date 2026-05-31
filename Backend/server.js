import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import customerRoutes from "./routes/customerRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import checkOverdueCustomers from "./utils/checkOverdueCustomers.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();
console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET =", process.env.RAZORPAY_KEY_SECRET);

const app = express();

connectDB();
checkOverdueCustomers();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/payment", paymentRoutes);

// AUTH ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(process.env.RAZORPAY_KEY_ID);
checkOverdueCustomers();
// CHECK EVERY 1 HOUR
setInterval(
  () => {
    checkOverdueCustomers();
  },
  60 * 60 * 1000,
);
