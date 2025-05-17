import { expressMiddleware } from "@apollo/server/express4";
import { app } from "./app";
import { PORT } from "./config";
import { server, startGraphqlServer } from "./graphql";
import { connectToDatabase } from "./utils/db";
import { VerifyToken } from "./utils";

const startServer = async () => {
  await connectToDatabase();
  await startGraphqlServer();
  //   graphql server injection in express middlewares
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        if (req.headers.authorization) {
          const access_token = req.headers.authorization;
          const data: any = await VerifyToken(access_token);
          return data;
        }
        return req.headers;
      },
    })
  );
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running at port: ${PORT}`);
  });
};

startServer();
