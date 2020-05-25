import * as Bcrypt from "bcryptjs";
import { GraphQLID, GraphQLList, GraphQLString } from "graphql";
import { isNullOrUndefined } from "util";
import User, { IUser } from "../../models/User";
import UserType from "../types/User.type";

export const Queries = {
  user: {
    args: {
      _id: {
        name: "User's id",
        type: GraphQLID,
      },
    },
    type: UserType,
    resolve: async (obj, args) =>
      JSON.parse(JSON.stringify(await User.findOne(args))),
  },
  users: {
    args: {},
    resolve: async (obj, args) =>
      (await User.find(args)).map((e) => JSON.parse(JSON.stringify(e))),
    type: new GraphQLList(UserType),
  },
};

export const Mutations = {
  updateUser: {
    type: UserType,
    args: {
      firstName: {
        name: "User's firstName",
        type: GraphQLString,
      },
      lastName: {
        name: "User's lastName",
        type: GraphQLString,
      },
      photoUrl: {
        name: "User's photo url",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args: IUser, { user }) => {
      if (!user) throw 401;
      delete args.salt;
      delete args.password;
      const newUser: IUser = Object.assign(user, args);
      const _id = newUser._id;
      delete newUser._id;
      return await User.updateOne({ _id }, newUser);
    },
  },
  updatePassword: {
    type: UserType,
    args: {
      oldPass: {
        name: "Old password",
        type: GraphQLString,
      },
      newPass: {
        name: "Old password",
        type: GraphQLString,
      },
    },
    resolve: async (
      obj,
      { oldPass, newPass }: { oldPass: string; newPass: string },
      { user }
    ) => {
      if (!user) throw 401;
      const foundUser = await User.findOne({ _id: user._id });
      if (isNullOrUndefined(foundUser)) throw 404;
      const isPasswordCorrect = Bcrypt.compareSync(oldPass, user.password);
      if (isPasswordCorrect === false) throw 400;

      const salt = Bcrypt.genSaltSync(8);
      user.password = Bcrypt.hashSync(newPass, salt);
      user.salt = salt;
      return await User.updateOne({ _id: user._id }, user);
    },
  },
};
