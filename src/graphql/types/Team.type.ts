import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
import OrgType from "./Org.type";
import UserType from "./User.type";
import { ITeam } from "../../models/Team";
import User, { IUser } from "../../models/User";
import Org, { IOrg } from "../../models/Org";

const TeamType = new GraphQLObjectType({
  name: "team",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
      isActive: {
        type: GraphQLString,
      },
      org: {
        type: OrgType,
        resolve: async (team: ITeam): Promise<IOrg> =>
          await Org.findOne({ _id: team.org }),
      },
      owner: {
        type: UserType,
        resolve: async (team: ITeam): Promise<IUser> =>
          await User.findOne({ _id: team.owner }),
      },
      members: {
        type: new GraphQLList(UserType),
        resolve: async (team: ITeam): Promise<IUser[]> =>
          await User.find({ _id: team.members }),
      },
    };
  },
});

export default TeamType;
