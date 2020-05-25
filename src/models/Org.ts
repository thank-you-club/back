import * as Mongoose from "mongoose";

export interface IOrg extends Mongoose.Document {
  name?: string;
  isActive?: boolean;
  owner?: string;
  members?: string[];
}

export const OrgSchema: Mongoose.Schema = new Mongoose.Schema({
  name: String,
  isActive: { type: Boolean, default: true },
  owner: String,
  members: [String],
});

export default Mongoose.model<IOrg>("Org", OrgSchema);
