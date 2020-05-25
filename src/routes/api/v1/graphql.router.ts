import { Router } from "express";
import * as graphqlHTTP from "express-graphql";

import schema from "../../../graphql/schema";
import HeaderToTokenMiddleware from "../../../middlewares/security/headerToToken.middleware";
import AuthMiddleware from "../../../middlewares/security/auth.middlewares";

const router = Router();

router.use(
  "/",
  HeaderToTokenMiddleware,
  AuthMiddleware,
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: {
      user: req.user,
    },
  }))
);

export default router;
