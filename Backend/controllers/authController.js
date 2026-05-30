import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// FIXED SHOPS
const allowedShops = [
  "Sri Lakshmi Kirana Store",
  "Annapurna Hotel",
  "Apollo Medical Store",
  "Fresh Basket Store",
  "Royal Bakery",
];

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, role, shopName } = req.body;

    // EMPTY CHECK
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // NAME VALIDATION
    const nameRegex = /^[A-Za-z\s]{3,30}$/;

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message:
          "Name should contain only alphabets and be 3-30 characters long",
      });
    }

    // PHONE VALIDATION
    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be 10 digits",
      });
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    // PASSWORD VALIDATION
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number and minimum 6 characters",
      });
    }

    // CHECK EXISTING EMAIL
    const existingUser = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already registered",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // SHOPKEEPER VALIDATION
    if (role === "shopkeeper") {
      // SHOP REQUIRED
      if (!shopName) {
        return res.status(400).json({
          message: "Please select a shop",
        });
      }

      // VALID SHOP CHECK
      if (!allowedShops.includes(shopName)) {
        return res.status(400).json({
          message: "Invalid shop selected",
        });
      }

      // ONE SHOPKEEPER PER SHOP
      const existingShopkeeper = await User.findOne({
        role: "shopkeeper",
        shopName,
      });

      if (existingShopkeeper) {
        return res.status(400).json({
          message: "This shop already has a registered shopkeeper",
        });
      }
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
      shopName: role === "shopkeeper" ? shopName : "",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password, role, shopName } = req.body;

    // EMPTY CHECK
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ROLE CHECK
    if (role && user.role !== role) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    // SHOP VALIDATION FOR SHOPKEEPER
    if (user.role === "shopkeeper") {
      if (!shopName) {
        return res.status(400).json({
          message: "Please select shop",
        });
      }

      if (user.shopName !== shopName) {
        return res.status(400).json({
          message: "Shop name does not match",
        });
      }
    }

    // TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
