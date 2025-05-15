import mongoose, { Schema, Document } from "mongoose";

export interface ServiceDocument extends Document {
  shop: mongoose.Types.ObjectId; // Reference to LaundryShop document
  name: string;
  description?: string;
  price: number;
}

const ServiceSchema: Schema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model<ServiceDocument>("Service", ServiceSchema);

export default ServiceModel;
