import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    shopkeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    udharLimit: {
      type: Number,
      default: 0,
    },

    currentBalance: {
      type: Number,
      default: 0,
    },

    finePerDay: {
      type: Number,
      default: 0,
    },
    totalFine: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "cleared", "overdue", "blocked", "archived"],
      default: "active",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
