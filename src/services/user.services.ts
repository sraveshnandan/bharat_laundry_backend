import AddressModel, { AddressDocument } from "../models/address.model";
import OrderModel, { OrderDocument } from "../models/order.model";
import UserModel, { UserDocument } from "../models/user.model";
import { AuthPayload } from "../types";
import { generate_Token, generateOTP } from "../utils";

const signinUser = async (
  phone: string
): Promise<{ message: string; userId?: string } | null> => {
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

    return {
      message: "OTP sent for verification.",
      userId: user._id.toString(),
    };
  } catch (error) {
    console.error("Error during phone sign-in initiation:", error);
    return { message: "Something went wrong. Please try again later." };
  }
};

const verifyOTP = async (
  userId: string,
  otp: number
): Promise<AuthPayload | null> => {
  try {
    const user = await UserModel.findById(userId);

    if (
      !user ||
      !user.otp ||
      user.otp.value !== otp ||
      user.otp.expiry < new Date()
    ) {
      return { message: "Invalid or expired OTP." }; // Invalid OTP or expired
    }

    // OTP is valid, mark phone as verified and clear the OTP
    user.isPhoneVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate access and refresh tokens
    const { access_token, refresh_token } = generate_Token(
      user._id.toString() as string
    );
    return { user, access_token, refresh_token };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Could not verify OTP");
  }
};

// Async function for adding a new address for a user
const addAddress = async (
  userId: string,
  street: string,
  city: string,
  state: string,
  postalCode: string,
  latitude?: number,
  longitude?: number,
  isDefault?: boolean
): Promise<AddressDocument> => {
  try {
    const newAddress = new AddressModel({
      street,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      isDefault,
      user: userId,
    });
    const savedAddress = await newAddress.save();

    // Update the user's addresses array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { addresses: savedAddress._id },
    });

    return savedAddress;
  } catch (error) {
    console.error("Error adding address:", error);
    throw new Error("Could not add address");
  }
};

// Async function for fetching a user's profile data
async function fetchUserProfile(userId: string): Promise<UserDocument | null> {
  try {
    const user = await UserModel.findById(userId)
      .populate("addresses")
      .populate("savedPaymentMethods");
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Could not fetch user profile");
  }
}

// Async function for fetching a user's order history
async function fetchUserOrders(userId: string): Promise<OrderDocument[]> {
  try {
    const orders = await OrderModel.find({ user: userId })
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
  userId: string,
  addressId: string
): Promise<AddressDocument | null> {
  try {
    const address = await AddressModel.findOne({
      _id: addressId,
      user: userId,
    });
    return address;
  } catch (error) {
    console.error("Error fetching user address:", error);
    throw new Error("Could not fetch user address");
  }
}

// Async function for updating an existing address for a user
async function updateUserAddress(
  userId: string,
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
      { _id: addressId, user: userId },
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
  userId: string,
  addressId: string
): Promise<boolean> {
  try {
    const result = await AddressModel.findOneAndDelete({
      _id: addressId,
      user: userId,
    });
    if (result) {
      // Remove the address reference from the user's addresses array
      await UserModel.findByIdAndUpdate(userId, {
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
  userId: string,
  updates: { name?: string; phone?: string; defaultAddressId?: string }
): Promise<UserDocument | null> {
  try {
    const { defaultAddressId, ...restOfUpdates } = updates;
    const updateQuery: any = { $set: restOfUpdates };

    if (defaultAddressId) {
      // Ensure the default address belongs to the user
      const address = await AddressModel.findOne({
        _id: defaultAddressId,
        user: userId,
      });
      if (!address) {
        throw new Error("Default address not found for this user");
      }
      updateQuery.$set.defaultAddress = defaultAddressId; // Consider how you want to store the default address (as a direct field or by querying addresses)
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });
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
