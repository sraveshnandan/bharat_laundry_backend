import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email?: string;
  phone: string;
  avatar: {
    public_id: string;
    url: string;
  };
  otp: {
    value: Number;
    expiry: Date;
  };
  isPhoneVerified?: boolean;
  addresses: mongoose.Types.ObjectId[];
  orderHistory: mongoose.Types.ObjectId[];
  savedPaymentMethods: mongoose.Types.ObjectId[];
  role: "CUSTOMER" | "SHOP_OWNER" | "DELIVERY_PARTNER" | "ADMIN";
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true },
    isPhoneVerified: { type: Boolean, default: false },
    avatar: {
      public_id: String,
      url: String,
    },
    otp: {
      value: Number,
      expiry: Date,
    },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    savedPaymentMethods: [
      { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
    ],
    role: {
      type: String,
      enum: ["CUSTOMER", "SHOP_OWNER", "DELIVERY_PARTNER", "ADMIN"],
      default: "CUSTOMER",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
