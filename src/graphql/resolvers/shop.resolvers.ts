// src/resolvers/shop.resolvers.ts

import { GraphQLError } from "graphql";
import { ShopService } from "../../services/shop.services";
import { IContext } from "../../types";
// Import your context type

const shopResolvers = {
  Query: {
    shop: async (_parent: any, { id }: { id: string }) => {
      return ShopService.fetchShopById(id);
    },
    nearbyShops: async (
      _parent: any,
      {
        latitude,
        longitude,
        radius,
      }: { latitude: number; longitude: number; radius?: number }
    ) => {
      return ShopService.fetchNearbyShops(latitude, longitude, radius);
    },
  },
  Mutation: {
    createShop: async (
      _parent: any,
      { name, addressInput, contactNumber, openingHours, banners }: any,
      context: IContext
    ) => {
      if (!context._id) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      if (
        context.role.toString() !== "SHOP_OWNER" &&
        context.role.toString() !== "ADMIN"
      ) {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      return ShopService.createShop(
        context._id,
        name,
        addressInput,
        contactNumber,
        openingHours,
        banners
      );
    },
    updateShop: async (
      _parent: any,
      { id, updates }: { id: string; updates: any },
      context: IContext
    ) => {
      if (!context._id) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      if (
        context.role.toString() !== "SHOP_OWNER" &&
        context.role.toString() !== "ADMIN"
      ) {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      return ShopService.updateShop(id, context._id, updates);
    },
    updateShopStatusByAdmin: async (
      _parent: any,
      {
        id,
        status,
      }: {
        id: string;
        status: "ACTIVE" | "INACTIVE" | "PENDING_APPROVAL" | "REJECTED";
      },
      context: IContext
    ) => {
      if (!context._id) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      if (context.role.toString() !== "ADMIN") {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      return ShopService.updateShopStatusByAdmin(id, status);
    },
  },
};

export { shopResolvers };
