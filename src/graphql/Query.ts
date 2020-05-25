import { GraphQLObjectType } from "graphql";
import { Queries as AuthQueries } from "./resolvers/Auth.resolver";
import { Queries as UserQueries } from "./resolvers/User.resolver";
import { Queries as OrgQueries } from "./resolvers/Org.resolver";
import { Queries as TeamQueries } from "./resolvers/Team.resolver";
import { Queries as CycleQueries } from "./resolvers/Cycle.resolver";

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: () =>
    Object.assign(
      {},
      AuthQueries,
      UserQueries,
      OrgQueries,
      TeamQueries,
      CycleQueries
    ),
});

export default QueryType;
