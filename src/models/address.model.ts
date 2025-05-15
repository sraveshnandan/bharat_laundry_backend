import mongoose, { Schema, Document } from "mongoose";

export interface AddressDocument extends Document {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
  user?: mongoose.Types.ObjectId;
  shop?: mongoose.Types.ObjectId;
}

const AddressSchema: Schema = new Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    shop: { type: Schema.Types.ObjectId, ref: "LaundryShop" },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model<AddressDocument>("Address", AddressSchema);

export default AddressModel;
