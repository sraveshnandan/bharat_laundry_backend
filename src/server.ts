import { expressMiddleware } from "@apollo/server/express4";
import { app } from "./app";
import { PORT } from "./config";
import { server, startGraphqlServer } from "./graphql";
import { connectToDatabase } from "./utils/db";
import { CheckInitialAuth } from "./utils";

const startServer = async () => {
  await connectToDatabase();
  await startGraphqlServer();
  //   graphql server injection in express middlewares
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        return req.headers;
      },
    })
  );
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
};

startServer();
