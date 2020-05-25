import * as Mongoose from "mongoose";

export interface ICycle extends Mongoose.Document {
  isActive?: boolean;
  team?: string[];
  startDate?: number;
  endDate?: number;
}

export const CycleSchema: Mongoose.Schema = new Mongoose.Schema({
  isActive: { type: Boolean, default: true },
  team: String,
  startDate: Number,
  endDate: Number,
});

export default Mongoose.model<ICycle>("Cycle", CycleSchema);
