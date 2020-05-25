import { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } from "graphql";
import Org, { IOrg } from "../../models/Org";
import OrgType from "../types/Org.type";
import { GraphQLNonNull } from "graphql";
import User, { IUser } from "../../models/User";
import sendEmail from "../../modules/email";
import * as jwt from "jsonwebtoken";
import * as Bcrypt from "bcryptjs";
import moment = require("moment");
export const Queries = {
  org: {
    args: {
      _id: {
        name: "Org's id",
        type: GraphQLID,
      },
    },
    type: OrgType,
    resolve: async (obj, args) =>
      JSON.parse(JSON.stringify(await Org.findOne(args))),
  },
  orgs: {
    args: {},
    resolve: async (obj, args, { user }: { user: IUser }) => {
      if (!user) throw 401;
      args.members = user._id;
      return (
        await Org.find(Object.assign(args, { isActive: true }))
      ).map((e) => JSON.parse(JSON.stringify(e)));
    },
    type: new GraphQLList(OrgType),
  },
};

export const Mutations = {
  insertOrg: {
    type: OrgType,
    args: {
      name: {
        name: "Org's name",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (obj, args: IOrg, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      args.owner = user._id;
      args.members = [user._id];
      const newOrg = await Org.insertMany([args]);
      return await JSON.parse(JSON.stringify(newOrg[0]));
    },
  },
  updateOrg: {
    type: OrgType,
    args: {
      _id: {
        name: "Org's _id",
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        name: "Org's name",
        type: GraphQLString,
      },
      members: {
        name: "Org's members",
        type: new GraphQLList(GraphQLString),
      },
    },
    resolve: async (obj, args: IOrg, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      let org = await Org.findOne({ _id: args._id });
      if (`${org.owner}` !== `${user._id}`) throw 401;
      org = Object.assign(org, args);
      org.save();
      return await JSON.parse(JSON.stringify(org));
    },
  },
  deleteOrg: {
    type: OrgType,
    args: {
      _id: {
        name: "Org's _id",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args: IOrg, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      const org = await Org.findOne({ _id: args._id });
      if (org.owner !== `${user._id}`) throw 401;
      org.isActive = false;
      return await org.save();
    },
  },
  addMemberToOrg: {
    type: OrgType,
    args: {
      _id: {
        name: "Org's _id",
        type: GraphQLString,
      },
      email: {
        name: "New member's email",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args: any, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      const org = await Org.findOne({ _id: args._id });
      if (org.owner !== `${user._id}`) throw 401;

      const foundMember = await User.findOne({
        email: args.email,
      });
      if (foundMember) {
        org.members.push(foundMember._id);
        return await org.save();
      }
      let newUser = new User({ email: args.email });
      const password = `${moment().unix()}`;
      const salt = Bcrypt.genSaltSync(8);
      newUser.password = Bcrypt.hashSync(password, salt);
      newUser.salt = salt;
      await newUser.save();
      newUser = await User.findOne({ email: args.email });
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
      // await generateApiKey(newUser._id, "Default", true, true, true, true);
      await sendEmail({
        to: newUser.email,
        subject: `Thank you from ${org.name}! You've been invited!`,
        html: `<h3>Welcome to the Thank you club!</h3>
        <p>You've been invited by ${org.name}</p>
        <p>You can login with these credentials</p>
        <ul>
          <li>Email: ${args.email}</li>
          <li>Password: ${password}</li>
        </ul>
        <a href="http://api.thank-you.club/api/v1/auth/validate-email?token=${token}">Click here to join!</a>
        <p>Please change your password once logged in for security reasons</p>`,
      });
      org.members.push(newUser._id);
      return await org.save();
    },
  },
};
