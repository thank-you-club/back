import { GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./User.type.js";
export default new GraphQLObjectType({
  name: "auth",
  fields: () => {
    return {
      token: {
        type: GraphQLString
      },
      user: {
        type: UserType
      }
    };
  }
});
