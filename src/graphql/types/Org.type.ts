import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
import User, { IUser } from "../../models/User";
import { IOrg } from "../../models/Org";
import UserType from "./User.type";
import TeamType from "./Team.type";
import Team, { ITeam } from "../../models/Team";

const OrgType = new GraphQLObjectType({
  name: "org",
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
      owner: {
        type: UserType,
        resolve: async (org: IOrg): Promise<IUser> =>
          await User.findOne({ _id: org.owner }),
      },
      members: {
        type: new GraphQLList(UserType),
        resolve: async (org: IOrg): Promise<IUser[]> =>
          await User.find({ _id: org.members }),
      },
      teams: {
        type: new GraphQLList(TeamType),
        resolve: async (org: IOrg): Promise<ITeam[]> =>
          await Team.find({ org: org._id }),
      },
    };
  },
});

export default OrgType;
