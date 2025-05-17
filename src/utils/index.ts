import { GraphQLError } from "graphql";
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY, SMS_GATEWAY_KEY } from "../config";
import JWT from "jsonwebtoken";
import { NextFunction } from "express";
import UserModel from "../models/user.model";
import axios from "axios";

const CheckInitialAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const generate_Token = (user_id: string) => {
  const access_token = JWT.sign({ _id: user_id }, JWT_ACCESS_KEY, {
    expiresIn: "30d",
  });
  const refresh_token = JWT.sign({ _id: user_id }, JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });

  return { access_token, refresh_token };
};

const sendOTP = async (phone: string, otp: number) => {
  try {
    const { data } = await axios.get(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${SMS_GATEWAY_KEY}&route=otp&variables_values=${otp}&flash=1&numbers=${phone}`
    );

    return data;
  } catch (error) {
    console.log(
      "Err occurred while sending OTP",
      JSON.stringify(error, null, 2)
    );
  }
};

const VerifyToken = async (access_token: string) => {
  try {
    const decoded_data: any = JWT.verify(access_token, JWT_ACCESS_KEY);
    const now = Math.floor(Date.now() / 1000);
    if (decoded_data.exp < now) {
      return new GraphQLError("Token expired.", {
        extensions: { code: "token_expired" },
      });
    }
    if (!decoded_data?._id) {
      return new GraphQLError("Invalid token.", {
        extensions: { code: "invalid_token" },
      });
    }
    const user = await UserModel.findById(decoded_data?._id);
    if (user) {
      const userData = user.toObject();
      return { ...userData, access_token };
    } else {
      return new GraphQLError("Invalid or expired access_token.");
    }
  } catch (error) {
    return new GraphQLError("Invalid or expired access_token.");
  }
};

export { CheckInitialAuth, generateOTP, generate_Token, sendOTP, VerifyToken };
