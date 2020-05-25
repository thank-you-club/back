import { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } from "graphql";
import Team, { ITeam } from "../../models/Team";
import TeamType from "../types/Team.type";
import { GraphQLNonNull } from "graphql";
import User, { IUser } from "../../models/User";
import Org from "../../models/Org";
import sendEmail from "../../modules/email";
import * as jwt from "jsonwebtoken";
import * as Bcrypt from "bcryptjs";
import moment = require("moment");
export const Queries = {
  team: {
    args: {
      _id: {
        name: "Team's id",
        type: GraphQLID,
      },
    },
    type: TeamType,
    resolve: async (obj, args) =>
      JSON.parse(JSON.stringify(await Team.findOne(args))),
  },
  teams: {
    args: {
      org: {
        name: "Team's org",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args, { user }: { user: IUser }) => {
      if (!user) throw 401;
      args.members = user._id.toString();
      return (
        await Team.find(Object.assign({}, args, { isActive: true }))
      ).map((e) => JSON.parse(JSON.stringify(e)));
    },
    type: new GraphQLList(TeamType),
  },
};

export const Mutations = {
  insertTeam: {
    type: TeamType,
    args: {
      name: {
        name: "Team's name",
        type: new GraphQLNonNull(GraphQLString),
      },
      org: {
        name: "Team's org",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (obj, args: ITeam, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      args.owner = user._id;
      args.members = [user._id];
      const newTeam = await Team.insertMany([args]);
      return await JSON.parse(JSON.stringify(newTeam[0]));
    },
  },
  updateTeam: {
    type: TeamType,
    args: {
      _id: {
        name: "Team's _id",
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        name: "Team's name",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args: ITeam, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      let team = await Team.findOne({ _id: args._id });
      const org = await Org.findOne({ _id: team.org });
      if (`${org.owner}` !== `${user._id}`) throw 401;
      team = Object.assign(team, args);
      team.save();
      return await JSON.parse(JSON.stringify(team));
    },
  },
  deleteTeam: {
    type: TeamType,
    args: {
      _id: {
        name: "Team's _id",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args: ITeam, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      const team = await Team.findOne({ _id: args._id });
      team.isActive = false;
      return await team.save();
    },
  },
  addMemberToOrgTeam: {
    type: TeamType,
    args: {
      _id: {
        name: "Teams's _id",
        type: GraphQLString,
      },
      email: {
        name: "New member's email",
        type: GraphQLString,
      },
    },
    resolve: async (obj, args: any, { user }: { user: IUser }) => {
      if (!args || !user) throw 401;
      const team = await Team.findOne({ _id: args._id });
      if (team.owner !== `${user._id}`) throw 401;
      const org = await Org.findOne({ _id: team.org });
      if (org.owner !== `${user._id}`) throw 401;
      const foundMember = await User.findOne({
        email: args.email,
      });
      if (foundMember) {
        org.members.push(foundMember._id);
        team.members.push(foundMember._id);
        await org.save();
        return await team.save();
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
      team.members.push(newUser._id);
      await org.save();
      return await team.save();
    },
  },
};
