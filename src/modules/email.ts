import { setApiKey, send } from "@sendgrid/mail";
import Axios from "axios";
import Domains, { IDomain } from "../models/Domains";
import { IUser } from "../models/User";
setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmail({
  to,
  html,
  attachmentData,
  attachmentName,
  from = "iva@iva-docs.com",
  subject = "Hey i'm done! Iva.",
}: {
  to: string;
  html: string;
  attachmentData?: string;
  attachmentName?: string;
  from?: string;
  subject?: string;
}) {
  const msg: any = {
    to,
    from,
    subject,
    html,
  };
  if (attachmentData && attachmentName) {
    msg.attachments = [
      {
        content: attachmentData,
        filename: attachmentName,
      },
    ];
  }
  return send(msg);
}

export function isValidEmail(str: string): boolean {
  const regMatchs = str.match(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return regMatchs && regMatchs.length > 0;
}

export async function addWhiteLabel(domain: string): Promise<any> {
  return (
    await Axios.post(
      "https://api.sendgrid.com/v3/whitelabel/domains",
      {
        domain,
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.SENDGRID_API_KEY,
        },
      }
    )
  ).data;
}
export async function validateWhiteLabel(domainId: string): Promise<any> {
  return (
    await Axios.post(
      `https://api.sendgrid.com/v3/whitelabel/domains/${domainId}/validate`,
      {},
      {
        headers: {
          Authorization: "Bearer " + process.env.SENDGRID_API_KEY,
        },
      }
    )
  ).data;
}

export function deleteWhiteLabel(domainId: string) {
  return Axios.delete(
    `https://api.sendgrid.com/v3/whitelabel/domains/${domainId}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.SENDGRID_API_KEY,
      },
    }
  );
}
export async function getWhitelabelDomains(domain: string) {
  return (
    await Axios.get("https://api.sendgrid.com/v3/whitelabel/domains", {
      headers: {
        authorization: "Bearer " + process.env.SENDGRID_API_KEY,
      },
    })
  ).data.filter((e) => e.domain === domain);
}

export async function updateDomain(
  domain: IDomain,
  user: IUser
): Promise<void> {
  const domainsSendgid = await getWhitelabelDomains(domain.domain);
  let myDomain = null;
  let domainIva = null;
  if (domainsSendgid && domainsSendgid.length > 0) {
    myDomain = domainsSendgid[0];
  } else {
    myDomain = await addWhiteLabel(domain.domain);
  }
  domainIva = await Domains.findOne({ domainId: myDomain.id });
  if (!domainIva || !domainIva._id) {
    domainIva = await Domains.findOne({ domain: domain.domain });
  }
  if (domainIva.owner === user._id.toString()) {
    domainIva.domainId = myDomain.id;
    domainIva.mailCnameHost = myDomain.dns.mail_cname.host;
    domainIva.mailCnameValue = myDomain.dns.mail_cname.data;
    domainIva.mailCnameValidated = myDomain.dns.mail_cname.valid;
    domainIva.dkim1Host = myDomain.dns.dkim1.host;
    domainIva.dkim1Value = myDomain.dns.dkim1.data;
    domainIva.dkim1Validated = myDomain.dns.dkim1.valid;
    domainIva.dkim2Host = myDomain.dns.dkim2.host;
    domainIva.dkim2Value = myDomain.dns.dkim2.data;
    domainIva.dkim2Validated = myDomain.dns.dkim2.valid;
    await domainIva.save();
    return;
  } else {
    throw 403;
  }
}
