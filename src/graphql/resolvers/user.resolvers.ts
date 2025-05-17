import { UserService } from "../../services/user.services";
import { IContext } from "../../types";
const userResolver = {
  Query: {
    me: async (_, __, context: IContext) => {
      const { _id } = context;
      const user = await UserService.fetchUserProfile(_id);
      return user;
    },
  },
  Mutation: {
    registerUser: async (_, { phone }, context: IContext) => {
      const { message, user_id, success } = await UserService.signinUser(phone);
      return { message, user_id, success };
    },
    verifyOtp: async (_, { otp, user_id }, context: IContext) => {
      const { user, access_token, refresh_token, message, success } =
        await UserService.verifyOTP(user_id, otp);

      return { user, access_token, refresh_token, message, success };
    },
    updateUserProfile: async (_, { input }, context: IContext) => {
      const { _id } = context;
      const updatedUser = await UserService.updateUserProfile(_id, input);
      return updatedUser;
    },
    addAddress: async (_, { address }, context: IContext) => {
      const { _id } = context;
      const newAddress = await UserService.addAddress(_id, address);
      return newAddress;
    },
    updateAddress: async (_, { id, address }, context: IContext) => {
      const { _id } = context;
      const updatedAddress = await UserService.updateUserAddress(
        _id,
        id,
        address
      );
      return updatedAddress;
    },
    deleteAddress: async (_, { id }, context: IContext) => {
      const { _id } = context;
      const isDeleted = await UserService.deleteUserAddress(_id, id);
      return isDeleted;
    },
  },
};

export { userResolver };
