import dotenv from "dotenv";
dotenv.config();

console.log("KEY ID =", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET =", process.env.RAZORPAY_KEY_SECRET);

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
