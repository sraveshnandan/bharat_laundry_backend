import { serviceResolvers } from "./resolvers/service.resolvers";
import { userResolver } from "./resolvers/user.resolvers";

const resolvers = {
  Query: {
    health: async (_, {}) => {
      return "All systems are operational.";
    },
    ...userResolver.Query,
    ...serviceResolvers.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...serviceResolvers.Mutation,
  },
};

export { resolvers };
