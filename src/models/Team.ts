import * as Mongoose from "mongoose";

export interface ITeam extends Mongoose.Document {
  name?: string;
  isActive?: boolean;
  org?: string;
  owner?: string;
  members?: string[];
}

export const TeamSchema: Mongoose.Schema = new Mongoose.Schema({
  name: String,
  isActive: { type: Boolean, default: true },
  org: String,
  owner: String,
  members: [String],
});

export default Mongoose.model<ITeam>("Team", TeamSchema);
