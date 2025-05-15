import { UserService } from "../../services/user.services";
const userResolver = {
  Query: {},
  Mutation: {
    registerUser: async (_, { phone }, context) => {
      const { message, user_id,success } = await UserService.signinUser(phone);
      return { message, user_id,success };
    },
    verifyOtp: async (_, { otp, user_id }, context) => {
      const { user, access_token, refresh_token, message, success } =
        await UserService.verifyOTP(user_id, otp);

      return { user, access_token, refresh_token, message, success };
    },
  },
};

export { userResolver };
