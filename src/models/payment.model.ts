import mongoose, { Schema, Document } from "mongoose";

export interface PaymentMethodDocument extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  details: any;
}

const PaymentMethodSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    details: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const PaymentMethodModel = mongoose.model<PaymentMethodDocument>(
  "PaymentMethod",
  PaymentMethodSchema
);

export default PaymentMethodModel;
