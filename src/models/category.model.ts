// src/models/category.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string; // e.g., "Dry Cleaning", "Wash & Fold", "Ironing"
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model<CategoryDocument>(
  "Category",
  CategorySchema
);

export default CategoryModel;
