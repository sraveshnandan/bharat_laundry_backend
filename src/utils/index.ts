import { GraphQLError } from "graphql";
import { CLIENT_KEY_1, JWT_ACCESS_KEY, JWT_REFRESH_KEY } from "../config";
import JWT from "jsonwebtoken";

const CheckInitialAuth = (token: string, req: any) => {
  if (token !== CLIENT_KEY_1) {
    return new GraphQLError("API Key is required.");
  } else {
    return req.headers;
  }
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

export { CheckInitialAuth, generateOTP, generate_Token };
