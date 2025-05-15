import mongoose, { Schema, Document } from "mongoose";

export interface OfferDocument extends Document {
  shop: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  discountPercentage?: number;
  discountAmount?: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const OfferSchema: Schema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop", required: true },
    name: { type: String, required: true },
    description: { type: String },
    discountPercentage: { type: Number, min: 0, max: 100 },
    discountAmount: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OfferModel = mongoose.model<OfferDocument>("Offer", OfferSchema);

export default OfferModel;
