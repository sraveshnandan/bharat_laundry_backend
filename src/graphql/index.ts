import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PORT } from "../config";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  cache: "bounded",
  csrfPrevention: true,
});

const startGraphqlServer = async () => {
  await server.start();
};

export { server, startGraphqlServer };
