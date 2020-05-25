import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import User, { IUser } from "../../models/User";
import { ITransaction } from "../../models/Transaction";
import Team from "../../models/Team";
import CycleType from "./Cycle.type";
import UserType from "./User.type";
import { ICycle } from "../../models/Cycle";

const TransactionType = new GraphQLObjectType({
  name: "transaction",
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
      },
      value: {
        type: GraphQLInt,
      },
      issuer: {
        type: GraphQLString,
      },
      target: {
        type: UserType,
        resolve: async (transaction: ITransaction): Promise<IUser> =>
          await User.findOne({ _id: transaction.target }),
      },
      cycle: {
        type: CycleType,
        resolve: async (transaction: ITransaction): Promise<ICycle> =>
          await Team.findOne({ _id: transaction.cycle }),
      },
    };
  },
});

export default TransactionType;
