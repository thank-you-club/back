import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";

const UserType = new GraphQLObjectType({
  name: "user",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      registeredAt: {
        name: "User's registeredAt",
        type: GraphQLString,
      },
      paidAt: {
        name: "User's paidAt",
        type: GraphQLString,
      },
      wasDeactivatedAt: {
        name: "User's wasDeactivatedAt",
        type: GraphQLString,
      },
      plan: {
        name: "User's plan",
        type: GraphQLString,
      },
      domain: {
        name: "User's domain",
        type: GraphQLString,
      },
      photoUrl: {
        name: "User's photo url",
        type: GraphQLString,
      },
      onBoardingStep: {
        name: "User's plan",
        type: GraphQLInt,
      },
      isActive: {
        name: "User's isActive",
        type: GraphQLBoolean,
      },
    };
  },
});

export default UserType;
