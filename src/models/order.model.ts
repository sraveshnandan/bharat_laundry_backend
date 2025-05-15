import mongoose, { Schema, Document } from "mongoose";

export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId; // Reference to User document
  shop: mongoose.Types.ObjectId; // Reference to LaundryShop document
  items: { service: mongoose.Types.ObjectId; quantity: number }[];
  pickupAddress: mongoose.Types.ObjectId; // Reference to Address document
  deliveryAddress: mongoose.Types.ObjectId; // Reference to Address document
  pickupTime?: Date;
  deliveryTime?: Date;
  status:
    | "PENDING"
    | "PROCESSING"
    | "READY_FOR_PICKUP"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  totalAmount: number;
  paymentMethod?: mongoose.Types.ObjectId; // Reference to PaymentMethod document
  deliveryPartner?: mongoose.Types.ObjectId; // Reference to User document (Delivery Partner)
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop", required: true },
    items: [
      {
        _id: false, // Prevent Mongoose from creating a default _id for sub-documents
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    pickupAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    pickupTime: { type: Date },
    deliveryTime: { type: Date },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "READY_FOR_PICKUP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
    deliveryPartner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);

export default OrderModel;
