// src/models/shop.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ShopDocument extends Document {
  owner: mongoose.Types.ObjectId; // Reference to User (Shop Owner)
  name: string;
  address: mongoose.Types.ObjectId; // Reference to Address
  contactNumber?: string;
  openingHours?: string;
  rating?: number;
  reviews: mongoose.Types.ObjectId[]; // References to Review
  services: mongoose.Types.ObjectId[]; // References to Service
  products: mongoose.Types.ObjectId[]; // References to Product
  photos: string[]; // Array of image URLs
  status: "ACTIVE" | "INACTIVE" | "PENDING_APPROVAL" | "REJECTED";
}

const ShopSchema: Schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
      unique: true,
    },
    contactNumber: { type: String },
    openingHours: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 3 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    banners: [
      { public_id: { type: String }, url: { type: String }, _id: false },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "PENDING_APPROVAL", "REJECTED"],
      default: "PENDING_APPROVAL",
    },
  },
  { timestamps: true }
);

const ShopModel = mongoose.model<ShopDocument>("LaundryShop", ShopSchema);

export default ShopModel;
