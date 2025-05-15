import { userResolver } from "./resolvers/user.resolvers";

const resolvers = {
  Query: {
    health: async (_, {}) => {
      return "All systems are operational.";
    },
    ...userResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};

export { resolvers };
