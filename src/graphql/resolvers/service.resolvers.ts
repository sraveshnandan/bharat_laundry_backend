import { GraphQLError } from "graphql";
import { ServiceService } from "../../services/service.services";
import { IContext } from "../../types";

const serviceResolvers = {
  Query: {
    services: async () => {
      return ServiceService.fetchAllServices();
    },
    service: async (_parent: any, { id }: { id: string }) => {
      return ServiceService.fetchServiceById(id);
    },
  },
  Mutation: {
    createServiceByAdmin: async (
      _parent: any,
      { input }: any,
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
      return ServiceService.createServiceByAdmin(input, context._id);
    },
    updateServiceByAdmin: async (
      _parent: any,
      { id, input }: { id: string; input: any },
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
      return ServiceService.updateServiceByAdmin(id, input, context._id);
    },
    deleteServiceByAdmin: async (_parent: any, { id }, context: IContext) => {
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
      const success = await ServiceService.deleteServiceByAdmin(
        id,
        context._id
      );
      return { success }; // GraphQL best practice to return an object for mutations
    },
  },
};

export { serviceResolvers };
