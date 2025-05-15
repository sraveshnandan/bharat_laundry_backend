import mongoose, { Schema, Document } from "mongoose";

export interface DeliveryPartnerDocument extends Document {
  user: mongoose.Types.ObjectId;
  currentLocation?: mongoose.Types.ObjectId;
  status: "AVAILABLE" | "ON_DUTY" | "OFFLINE" | "BUSY";
}

const DeliveryPartnerSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentLocation: { type: Schema.Types.ObjectId, ref: "Address" },
    status: {
      type: String,
      enum: ["AVAILABLE", "ON_DUTY", "OFFLINE", "BUSY"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

const DeliveryPartnerModel = mongoose.model<DeliveryPartnerDocument>(
  "DeliveryPartner",
  DeliveryPartnerSchema
);

export default DeliveryPartnerModel;
