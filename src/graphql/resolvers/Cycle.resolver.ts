import { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } from "graphql";
import Cycle, { ICycle } from "../../models/Cycle";
import CycleType from "../types/Cycle.type";
import { GraphQLNonNull } from "graphql";
import { IUser } from "../../models/User";
import moment = require("moment");
import Transaction from "../../models/Transaction";
export const Queries = {
  cycle: {
    args: {
      _id: {
        name: "Cycle's id",
        type: GraphQLID,
      },
    },
    type: CycleType,
    resolve: async (obj, args) =>
      JSON.parse(JSON.stringify(await Cycle.findOne(args))),
  },
  cycles: {
    args: {
      team: {
        name: "Cycle's team",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (obj, args, { user }: { user: IUser }) => {
      if (!user) throw 401;
      return (
        await Cycle.find(Object.assign(args, { isActive: true }), [], {
          sort: {
            startDate: -1,
          },
        })
      ).map((e) => JSON.parse(JSON.stringify(e)));
    },
    type: new GraphQLList(CycleType),
  },
};

export const Mutations = {
  nextCycle: {
    type: CycleType,
    args: {
      team: {
        name: "Cycle's teams",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (obj, args: ICycle, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      const cycle = await Cycle.findOne({ team: args.team, endDate: -1 });
      if (cycle && cycle._id) {
        cycle.endDate = moment().unix();
        await cycle.save();
      }
      const newCycle = await Cycle.insertMany([
        {
          team: args.team,
          endDate: -1,
          startDate: moment().unix(),
        },
      ]);
      return await JSON.parse(JSON.stringify(newCycle[0]));
    },
  },
  endorseMember: {
    type: CycleType,
    args: {
      team: {
        name: "Cycle's teams",
        type: new GraphQLNonNull(GraphQLString),
      },
      target: {
        name: "Cycle's teams",
        type: new GraphQLNonNull(GraphQLString),
      },
      value: {
        name: "Cycle's teams",
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: async (obj, args: any, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      const cycle = await Cycle.findOne({ team: args.team, endDate: -1 });
      if (!cycle || !cycle._id) {
        throw 404;
      }
      const previousTransactions = await Transaction.find({
        issuer: user._id,
        cycle: cycle._id,
      });
      const totalPointGiven = previousTransactions.reduce(
        (p, c) => p + c.value,
        0
      );
      if (totalPointGiven + args.value > 1000 || args.value <= 0) throw 400;
      const newTransaction = new Transaction({
        issuer: user._id,
        target: args.target,
        value: args.value,
        cycle: cycle._id,
      });
      await newTransaction.save();
      return cycle;
    },
  },
};
