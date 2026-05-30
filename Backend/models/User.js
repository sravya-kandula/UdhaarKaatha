import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // NAME
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // EMAIL
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // PASSWORD
    password: {
      type: String,
      required: true,
    },

    // ROLE
    role: {
      type: String,
      enum: ["customer", "shopkeeper"],
      default: "customer",
    },

    // SHOP NAME
    shopName: {
      type: String,
      default: "",
    },

    // SHOP ID
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
