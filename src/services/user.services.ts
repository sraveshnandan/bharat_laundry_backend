import AddressModel, { AddressDocument } from "../models/address.model";
import OrderModel, { OrderDocument } from "../models/order.model";
import UserModel, { UserDocument } from "../models/user.model";
import { AuthPayload } from "../types";
import { generate_Token, generateOTP, sendOTP } from "../utils";

const signinUser = async (
  phone: string
): Promise<{ message: string; user_id?: string; success: boolean } | null> => {
  try {
    let user = await UserModel.findOne({ phone });

    if (!user) {
      //   Creating new user
      user = new UserModel({ phone });
      await user.save();
      console.log(`New user created with phone: ${phone}, ID: ${user._id}`);
    }

    // Generate and store OTP
    const otpValue = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    user.otp = { value: otpValue, expiry: otpExpiry };
    await user.save();

    // sending otp to user number
    await sendOTP(user.phone, otpValue);

    return {
      message: "OTP sent for verification.",
      user_id: user._id.toString(),
      success: true,
    };
  } catch (error) {
    console.error("Error during phone sign-in initiation:", error);
    return {
      message: "Something went wrong. Please try again later.",
      success: false,
    };
  }
};

const verifyOTP = async (
  user_id: string,
  otp: number
): Promise<AuthPayload | null> => {
  try {
    const user = await UserModel.findById(user_id);

    if (!user) {
      return { message: "No account found.", success: false };
    }

    if (!user.isPhoneVerified) {
      console.log("user_otp", otp);

      const isOtpMatched = otp === user.otp.value;
      // to fixed expiry logic
      const isOtpExpired = user.otp.expiry < new Date(Date.now());

      if (isOtpMatched) {
        user.isPhoneVerified = true;
        user.otp = undefined;
        await user.save();
      } else {
        return { success: false, message: "Invalid or expired OTP." };
      }
    }

    const { access_token, refresh_token } = generate_Token(
      user._id.toString() as string
    );
    console.log(`User with ID : ${user._id} has verified their phone number. `);
    return {
      user,
      access_token,
      refresh_token,
      message: "OTP verified successfully.",
      success: true,
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { message: "Something went wrong.", success: false };
  }
};

// Async function for adding a new address for a user
const addAddress = async (
  user_id: string,
  addressData: Record<string, any>
): Promise<AddressDocument> => {
  try {
    const newAddress = new AddressModel({
      ...addressData,
      user: user_id,
    });
    const savedAddress = await newAddress.save();

    // Update the user's addresses array
    await UserModel.findByIdAndUpdate(user_id, {
      $push: { addresses: savedAddress._id },
    });

    return savedAddress;
  } catch (error) {
    console.error("Error adding address:", error);
    throw new Error("Could not add address");
  }
};

// Async function for fetching a user's profile data
async function fetchUserProfile(user_id: string): Promise<UserDocument | null> {
  try {
    console.log(`Fetching profile for user ID: ${user_id}`);
    const user = await UserModel.findById(user_id).populate("addresses");
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Could not fetch user profile");
  }
}

// Async function for fetching a user's order history
async function fetchUserOrders(user_id: string): Promise<OrderDocument[]> {
  try {
    const orders = await OrderModel.find({ user: user_id })
      .populate("shop")
      .populate("items.service")
      .populate("pickupAddress")
      .populate("deliveryAddress");
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Could not fetch user orders");
  }
}

// Async function for fetching a specific address for a user
async function fetchUserAddress(
  user_id: string,
  addressId: string
): Promise<AddressDocument | null> {
  try {
    const address = await AddressModel.findOne({
      _id: addressId,
      user: user_id,
    });
    return address;
  } catch (error) {
    console.error("Error fetching user address:", error);
    throw new Error("Could not fetch user address");
  }
}

// Async function for updating an existing address for a user
async function updateUserAddress(
  user_id: string,
  addressId: string,
  updates: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }
): Promise<AddressDocument | null> {
  try {
    const updatedAddress = await AddressModel.findOneAndUpdate(
      { _id: addressId, user: user_id },
      { $set: updates },
      { new: true }
    );
    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    throw new Error("Could not update address");
  }
}

// Async function for deleting an address for a user
async function deleteUserAddress(
  user_id: string,
  addressId: string
): Promise<boolean> {
  try {
    const result = await AddressModel.findOneAndDelete({
      _id: addressId,
      user: user_id,
    });
    if (result) {
      // Remove the address reference from the user's addresses array
      await UserModel.findByIdAndUpdate(user_id, {
        $pull: { addresses: addressId },
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw new Error("Could not delete address");
  }
}

// Async function for updating a user's profile
async function updateUserProfile(
  user_id: string,
  updates: { name?: string; email?: string; defaultAddressId?: string }
): Promise<UserDocument | null> {
  try {
    const { defaultAddressId, ...restOfUpdates } = updates;
    const updateQuery: any = { $set: restOfUpdates };

    if (defaultAddressId) {
      // Ensure the default address belongs to the user
      const address = await AddressModel.findOne({
        _id: defaultAddressId,
        user: user_id,
      });
      if (!address) {
        throw new Error("Default address not found for this user");
      }
      updateQuery.$set.defaultAddress = defaultAddressId; // Consider how you want to store the default address (as a direct field or by querying addresses)
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      updateQuery,
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Could not update user profile");
  }
}

export const UserService = {
  signinUser,
  verifyOTP,
  addAddress,
  fetchUserProfile,
  fetchUserOrders,
  fetchUserAddress,
  updateUserAddress,
  deleteUserAddress,
  updateUserProfile,
};
