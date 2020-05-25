import * as Mongoose from "mongoose";

export interface IApiKey extends Mongoose.Document {
  key?: string;
  name?: string;
  isActive?: boolean;
  isIvaDefault?: boolean;
  owner?: string;
  hasDocxGeneration?: boolean;
  hasGenerationApi?: boolean;
  hasConversionApi?: boolean;
}

export const ApiKeySchema: Mongoose.Schema = new Mongoose.Schema({
  key: String,
  name: String,
  isActive: Boolean,
  isIvaDefault: Boolean,
  owner: String,
  hasDocxGeneration: { type: Boolean, default: false },
  hasGenerationApi: { type: Boolean, default: false },
  hasConversionApi: { type: Boolean, default: false },
});

export default Mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
