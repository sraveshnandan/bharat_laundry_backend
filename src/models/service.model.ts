import mongoose, { Schema, Document } from "mongoose";

export interface ServiceDocument extends Document {
  shop: mongoose.Types.ObjectId; // Reference to LaundryShop document
  name: string;
  description?: string;
  image: {
    public_id?: string;
    url?: string;
  };
  categories: mongoose.Types.ObjectId[]; // Array of references to Category documents
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId; // Reference to User document
}

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model<ServiceDocument>("Service", ServiceSchema);

export default ServiceModel;
