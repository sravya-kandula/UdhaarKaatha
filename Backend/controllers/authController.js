import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

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

    console.log("========== REGISTER USER ==========");
    console.log("Request Body:", req.body);
    console.log("Name:", name);
    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Role:", role);
    console.log("Shop Name:", shopName);

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

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    console.log("Existing User:", existingUser);
    console.log("Existing Phone:", existingPhone);

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
      if (!shopName) {
        return res.status(400).json({
          message: "Please select a shop",
        });
      }

      if (!allowedShops.includes(shopName)) {
        return res.status(400).json({
          message: "Invalid shop selected",
        });
      }

      const existingShopkeeper = await User.findOne({
        role: "shopkeeper",
        shopName,
      });

      console.log("Existing Shopkeeper:", existingShopkeeper);

      if (existingShopkeeper) {
        return res.status(400).json({
          message: "This shop already has a registered shopkeeper",
        });
      }
    }

    // HASH PASSWORD
    console.log("Hashing Password...");
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

    // LINK CUSTOMER ACCOUNT TO EXISTING CUSTOMER RECORD
    if (role === "customer") {
      const linkedCustomers = await Customer.updateMany(
        {
          phone,
        },
        {
          userId: user._id,
        },
      );

      console.log("Linked Customer Records:", linkedCustomers.modifiedCount);
    }

    console.log("Customer Registration User ID:", user._id);
    console.log("Customer Registration Phone:", phone);

    console.log("User Created:", user._id);
    console.log("========== REGISTER SUCCESS ==========");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password, role, shopName } = req.body;

    console.log("========== LOGIN USER ==========");
    console.log("Email:", email);
    console.log("Role:", role);
    console.log("Shop Name:", shopName);

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

    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

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

    // SHOP VALIDATION
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
    console.log("Generating Token...");
    console.log("User ID:", user._id);
    console.log("User Role:", user.role);

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

    console.log("Login Successful");
    console.log("========== LOGIN SUCCESS ==========");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
