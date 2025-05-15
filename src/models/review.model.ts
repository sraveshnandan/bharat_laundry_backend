import mongoose, { Schema, Document } from "mongoose";

export interface ReviewDocument extends Document {
  user: mongoose.Types.ObjectId; // Reference to User document
  shop: mongoose.Types.ObjectId; // Reference to LaundryShop document
  rating: number;
  comment?: string;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<ReviewDocument>("Review", ReviewSchema);

export default ReviewModel;
