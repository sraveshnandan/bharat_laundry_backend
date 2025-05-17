import AddressModel from "../models/address.model";
import ShopModel, { ShopDocument } from "../models/shop.model";
import UserModel from "../models/user.model";

async function createShop(
  ownerId: string,
  name: string,
  addressInput: {
    latitude: number;
    longitude: number;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    isDefault?: boolean;
  },
  contactNumber?: string,
  openingHours?: string,
  banners?: { public_id?: string; url?: string }[]
): Promise<ShopDocument> {
  try {
    const newAddress = new AddressModel({ ...addressInput });
    const savedAddress = await newAddress.save();

    const newShop = new ShopModel({
      owner: ownerId,
      name,
      address: savedAddress._id,
      contactNumber,
      openingHours,
      banners,
    });
    const savedShop = await newShop.save();

    const user = await UserModel.findById(ownerId);
    if (user && user.role !== "SHOP_OWNER") {
      await UserModel.findByIdAndUpdate(ownerId, { role: "SHOP_OWNER" });
    }

    return savedShop;
  } catch (error) {
    console.error("Error creating shop:", error);
    throw new Error("Could not create laundry shop");
  }
}

// Async function to fetch a specific laundry shop by ID
async function fetchShopById(shopId: string): Promise<ShopDocument | null> {
  try {
    const shop = await ShopModel.findById(shopId)
      .populate("owner")
      .populate("address")
      .populate("services")
      .populate("products")
      .populate("reviews");
    return shop;
  } catch (error) {
    console.error("Error fetching shop by ID:", error);
    throw new Error("Could not fetch laundry shop");
  }
}

// Async function to fetch nearby laundry shops (needs geospatial implementation)
async function fetchNearbyShops(
  latitude: number,
  longitude: number,
  radius: number = 5
): Promise<ShopDocument[]> {
  try {
    // Implement geospatial query using $geoNear or similar
    const shops = await ShopModel.find({
      // Placeholder for geospatial query
    })
      .populate("owner")
      .populate("address")
      .populate("services")
      .populate("products");
    return shops;
  } catch (error) {
    console.error("Error fetching nearby shops:", error);
    throw new Error("Could not fetch nearby laundry shops");
  }
}

// Async function to update a laundry shop's information (for owner)
async function updateShop(
  shopId: string,
  ownerId: string,
  updates: {
    name?: string;
    contactNumber?: string;
    openingHours?: string;
    banners?: { public_id?: string; url?: string }[];
  }
): Promise<ShopDocument | null> {
  try {
    const shop = await ShopModel.findOne({ _id: shopId, owner: ownerId });
    if (!shop) {
      throw new Error("Shop not found or you are not the owner");
    }
    const updatedShop = await ShopModel.findByIdAndUpdate(
      shopId,
      { $set: updates },
      { new: true }
    );
    return updatedShop;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw new Error("Could not update laundry shop");
  }
}

// Async function for admin to update shop status
async function updateShopStatusByAdmin(
  shopId: string,
  status: "ACTIVE" | "INACTIVE" | "PENDING_APPROVAL" | "REJECTED"
): Promise<ShopDocument | null> {
  try {
    const updatedShop = await ShopModel.findByIdAndUpdate(
      shopId,
      { status },
      { new: true }
    );
    return updatedShop;
  } catch (error) {
    console.error("Error updating shop status:", error);
    throw new Error("Could not update shop status");
  }
}

export const ShopService = {
  createShop,
  fetchShopById,
  fetchNearbyShops,
  updateShop,
  updateShopStatusByAdmin,
};
