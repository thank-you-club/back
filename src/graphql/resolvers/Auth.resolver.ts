import { isNullOrUndefined } from "util";

import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from "graphql";
import AuthType from "../types/Auth.type";
import User, { IUser } from "../../models/User";
import * as Bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import UserType from "../types/User.type";
import moment = require("moment");
import { Plans } from "../../constants/Plans";
// import { generateApiKey } from "../../modules/apiKey";
import { isValidEmail } from "../../modules/email";
import sendEmail from "../../modules/email";
// import { AddSub } from "../../modules/mailerliter";

export const Mutations = {
  register: {
    type: AuthType,
    args: {
      email: {
        name: "User's email",
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        name: "User's plain text password",
        type: new GraphQLNonNull(GraphQLString),
      },
      firstName: {
        name: "User's firstName",
        type: new GraphQLNonNull(GraphQLString),
      },
      lastName: {
        name: "User's lastName",
        type: new GraphQLNonNull(GraphQLString),
      },
      photoUrl: {
        name: "User's photo url",
        type: GraphQLString,
      },
      isSubscribedToNewsletter: {
        name: "User's agreement to subscribe to our new letter",
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      isAgreeingToTermsOfService: {
        name: "User's agreement to ",
        type: new GraphQLNonNull(GraphQLBoolean),
      },
    },
    resolve: async (obj, user: IUser) => {
      if ((await isValidEmail(user.email)) === false) throw 403;
      const isEmailUsed = !isNullOrUndefined(
        await User.findOne({ email: user.email })
      );
      if (isEmailUsed) throw 400;
      const salt = Bcrypt.genSaltSync(8);
      user.password = Bcrypt.hashSync(user.password, salt);
      user.salt = salt;
      user.registeredAt = moment().unix();
      user.plan = Plans.Free;
      let newUser = new User(user);
      await newUser.save();
      newUser = await User.findOne({ email: user.email });
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
      // await generateApiKey(newUser._id, "Default", true, true, true, true);
      await sendEmail({
        to: newUser.email,
        subject: "Email validation from Iva",
        html: `<h3>Hey! Just click the link below!</h3>
        <p>To activate your account, please click the link bellow:</p>
        <a href="http://api.thank-you.club/api/v1/auth/validate-email?token=${token}">http://api.thank-you.club/api/v1/auth/validate-email?token=${token}</a>`,
      });
      // if (newUser.isSubscribedToNewsletter === true) {
      //   AddSub(newUser);
      // }
      return { token, user: JSON.parse(JSON.stringify(newUser)) };
    },
  },
  login: {
    type: AuthType,
    args: {
      email: {
        name: "User's email",
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        name: "User's password",
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (obj, { email, password }) => {
      const user = await User.findOne({ email });
      if (isNullOrUndefined(user)) throw 404;
      const isPasswordCorrect = Bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect === false) throw 400;
      if (user.isActive === false) throw 403;
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return { token, user: JSON.parse(JSON.stringify(user)) };
    },
  },
};

export const Queries = {
  me: {
    type: UserType,
    args: {},
    resolve: async (obj, args, { user }) => {
      if (!user) throw 400;
      return JSON.parse(JSON.stringify(user));
    },
  },
};
