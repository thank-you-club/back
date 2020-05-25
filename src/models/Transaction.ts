import * as Mongoose from "mongoose";

export interface ITransaction extends Mongoose.Document {
  value?: number;
  issuer?: string;
  target?: string;
  cycle?: string;
}

export const TransactionSchema: Mongoose.Schema = new Mongoose.Schema({
  value: Number,
  issuer: String,
  target: String,
  cycle: String,
});

export default Mongoose.model<ITransaction>("Transaction", TransactionSchema);
