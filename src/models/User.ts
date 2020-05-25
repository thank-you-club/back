import * as Mongoose from "mongoose";
import { Plans } from "../constants/Plans";
import ApiKey from "./ApiKey";

export interface IUser extends Mongoose.Document {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  salt?: string;
  photoUrl?: string;
  isActive?: boolean;
  registeredAt?: number;
  paidAt?: number;
  plan?: Plans;
  onBoardingStep?: number;
  wasDeactivatedAt?: number;
  isEmailActivated?: boolean;
  isSubscribedToNewsletter?: boolean;
  isAgreeingToTermsOfService?: boolean;
}

export const UserSchema: Mongoose.Schema = new Mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, default: "" },
  password: String,
  salt: String,
  photoUrl: String,
  isActive: { type: Boolean, default: true },
  wasDeactivatedAt: Number,
  registeredAt: Number,
  paidAt: Number,
  plan: String,
  onBoardingStep: { type: Number, default: 0 },
  googleDrive: {
    refresh_token: String,
    folderId: String,
    scope: String,
  },
  isEmailActivated: { type: Boolean, default: false },
  isSubscribedToNewsletter: { type: Boolean, default: false },
  isAgreeingToTermsOfService: { type: Boolean, default: false },
});
UserSchema.pre("remove", async () => {
  await ApiKey.deleteMany({
    owner: this._id,
  });
});

export default Mongoose.model<IUser>("User", UserSchema);
