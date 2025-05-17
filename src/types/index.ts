import { UserDocument } from "../models/user.model";

export interface AuthPayload {
  user?: UserDocument;
  access_token?: string;
  refresh_token?: string;
  message?: string;
  success?: boolean;
}

export interface IContext {
  _id: string;
  phone: string;
  isPhoneVerified: boolean;
  addresses: string[];
  orderHistory: string[];
  savedPaymentMethods: string[];
  role: "CUSTOMER";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  email: string;
  name: string;
  access_token: string;
}
