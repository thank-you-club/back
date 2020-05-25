import * as Mongoose from "mongoose";

export interface IDomain extends Mongoose.Document {
  domain: string;
  owner: string;
  domainId: string;
  isActive: boolean;
  mailCnameHost: string;
  mailCnameValue: string;
  mailCnameValidated: boolean;
  dkim1Host: string;
  dkim1Value: string;
  dkim1Validated: boolean;
  dkim2Host: string;
  dkim2Value: string;
  dkim2Validated: boolean;
}

export const DomainSchema: Mongoose.Schema = new Mongoose.Schema({
  domain: String,
  domainId: String,
  owner: String,
  isActive: Boolean,
  mailCnameHost: String,
  mailCnameValue: String,
  mailCnameValidated: Boolean,
  dkim1Host: String,
  dkim1Value: String,
  dkim1Validated: Boolean,
  dkim2Host: String,
  dkim2Value: String,
  dkim2Validated: Boolean,
});

export default Mongoose.model<IDomain>("Domain", DomainSchema);
