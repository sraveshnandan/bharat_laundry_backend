// src/models/product.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ProductDocument extends Document {
  shop: mongoose.Types.ObjectId; // Reference to LaundryShop
  service: mongoose.Types.ObjectId; // Reference to Service (e.g., Dry Cleaning)
  name: string; // e.g., "Belt", "Coat"
  rate: number;
  imageUrl?: string;
  extraProductDetails?: {
    name: string; // e.g., "Anti-bacterial Cleaning"
    description?: string; // e.g., "Kills 100% germs"
    additionalRate: number;
  };
}

const ProductSchema: Schema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    imageUrl: { public_id: String, url: String },
    extraProductDetails: {
      name: { type: String },
      description: { type: String },
      additionalRate: { type: Number, default: 0 },
      _id: false,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<ProductDocument>("Product", ProductSchema);

export default ProductModel;
