import { GraphQLSchema } from "graphql";
import Query from "./Query";
import Mutation from "./Mutation";
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
