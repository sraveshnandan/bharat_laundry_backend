import mongoose, { Schema, Document } from "mongoose";

export interface ShopDocument extends Document {
  owner: mongoose.Types.ObjectId; // Reference to User document (Shop Owner)
  name: string;
  address: mongoose.Types.ObjectId; // Reference to Address document
  contactNumber?: string;
  openingHours?: string;
  rating?: number;
  reviews: mongoose.Types.ObjectId[]; // References to Review documents
  services: mongoose.Types.ObjectId[]; // References to Service documents
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
    rating: { type: Number, min: 0, max: 5 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    photos: [String],
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
