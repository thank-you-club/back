import { GraphQLObjectType } from "graphql";
import { Mutations as AuthResolvers } from "./resolvers/Auth.resolver";
import { Mutations as UserMutations } from "./resolvers/User.resolver";
import { Mutations as OrgMutations } from "./resolvers/Org.resolver";
import { Mutations as TeamMutations } from "./resolvers/Team.resolver";
import { Mutations as CycleMutations } from "./resolvers/Cycle.resolver";

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () =>
    Object.assign(
      {},
      AuthResolvers,
      UserMutations,
      OrgMutations,
      TeamMutations,
      CycleMutations
    ),
});

export default MutationType;
