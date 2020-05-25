import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from "graphql";
import User, { IUser } from "../../models/User";
import { ICycle } from "../../models/Cycle";
import UserType from "./User.type";
import Team from "../../models/Team";
import TransactionType from "./Transaction.type";
import Transaction, { ITransaction } from "../../models/Transaction";

const CycleType = new GraphQLObjectType({
  name: "cycle",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      startDate: {
        type: GraphQLInt,
      },
      endDate: {
        type: GraphQLInt,
      },
      isActive: {
        type: GraphQLString,
      },
      team: {
        type: UserType,
        resolve: async (cycle: ICycle): Promise<IUser> =>
          await Team.findOne({ _id: cycle.team }),
      },
      transactions: {
        type: new GraphQLList(TransactionType),
        resolve: async (cycle: ICycle): Promise<ITransaction[]> =>
          await Transaction.find({ cycle: cycle._id }),
      },
    };
  },
});

export default CycleType;
