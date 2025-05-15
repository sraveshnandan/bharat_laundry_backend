import mongoose, { Schema, Document } from "mongoose";

export interface SlidingBannerDocument extends Document {
  shop: mongoose.Types.ObjectId;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

const SlidingBannerSchema: Schema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop", default: null },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SlidingBannerModel = mongoose.model<SlidingBannerDocument>(
  "SlidingBanner",
  SlidingBannerSchema
);

export default SlidingBannerModel;
