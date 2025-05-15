import { UserDocument } from "../models/user.model";

export interface AuthPayload {
  user?: UserDocument;
  access_token?: string;
  refresh_token?: string;
  message?: string;
  success?: boolean;
}
