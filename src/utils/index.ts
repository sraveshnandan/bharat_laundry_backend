import { GraphQLError } from "graphql";
import { CLIENT_KEY_1, JWT_ACCESS_KEY, JWT_REFRESH_KEY } from "../config";
import JWT from "jsonwebtoken";
import { NextFunction } from "express";

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
    expiresIn: "30d",
  });

  return { access_token, refresh_token };
};

const sendOTP = async (phone: string) => {
  try {
  } catch (error) {
    console.log(
      "Err occurred while sending OTP",
      JSON.stringify(error, null, 2)
    );
  }
};

export { CheckInitialAuth, generateOTP, generate_Token, sendOTP };
