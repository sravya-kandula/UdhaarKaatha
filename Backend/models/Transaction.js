import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    shopkeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [
      {
        itemName: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    paymentType: {
      type: String,
      enum: ["paid", "udhar"],
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["purchase", "payment"],
      default: "purchase",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "partial"],
      default: "pending",
    },

    dueDate: {
      type: Date,
    },

    fineAmount: {
      type: Number,
      default: 0,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
