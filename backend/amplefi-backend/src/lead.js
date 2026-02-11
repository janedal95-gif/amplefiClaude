const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const crypto = require("crypto");

const ddb = new DynamoDBClient({});
const ses = new SESClient({ region: "us-east-1" });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM_EMAIL = "hello@amplefi.com";
const DEFAULT_NOTIFY_EMAILS = "jane.dalesandro@amplefi.com,jdalesandro@amplefi.com";
const UNSUBSCRIBE_BASE_URL = "https://brv2v7x1y9.execute-api.us-east-1.amazonaws.com";
const HERO_IMAGE_URL = "https://amplefi.com/AmplefiWater.jpeg";

function getNotifyEmails() {
  const raw = process.env.NOTIFY_EMAILS || DEFAULT_NOTIFY_EMAILS;
  return raw.split(",").map((email) => email.trim()).filter(Boolean);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildUnsubscribeToken(email) {
  const secret = process.env.UNSUB_SECRET || "";
  return crypto
    .createHmac("sha256", secret)
    .update(email)
    .digest("base64url");
}

function buildUnsubscribeUrl(email) {
  const token = buildUnsubscribeToken(email);
  return `${UNSUBSCRIBE_BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
}

async function getSubscriberStatus(email) {
  const result = await ddb.send(
    new GetItemCommand({
      TableName: process.env.SUBSCRIBERS_TABLE,
      Key: { email: { S: email } },
      ProjectionExpression: "#status",
      ExpressionAttributeNames: { "#status": "status" },
    })
  );
  return result.Item?.status?.S || "";
}

async function sendAutoReply(toAddress) {
  const unsubscribeUrl = buildUnsubscribeUrl(toAddress);
  const html = `
<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>We got your request</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0B1B34;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:#0B1B34;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td align="center" style="padding:0;margin:0;background-color:#0B1B34;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td
                background="${HERO_IMAGE_URL}"
                bgcolor="#0B1B34"
                height="720"
                valign="top"
                style="background-image:url('${HERO_IMAGE_URL}');background-size:cover;background-position:center center;background-repeat:no-repeat;height:720px;"
              >
                <!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:720px;">
                  <v:fill type="frame" src="${HERO_IMAGE_URL}" color="#0B1B34" />
                  <v:textbox inset="0,0,0,0">
                <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="720" style="width:100%;height:720px;">
                  <tr>
                    <td align="center" valign="top" style="padding:64px 20px 18px 20px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="544" style="width:100%;max-width:544px;background-color:transparent;border-radius:16px;">
                        <tr>
                          <td align="center" style="padding:36px 28px;">
                            <h1 style="margin:0 0 18px 0;font-family:Arial,sans-serif;font-size:32px;line-height:1.25;font-weight:800;color:#FFFFFF;">
                              Thank you for requesting a Demo with Amplefi.
                            </h1>
                            <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:18px;line-height:1.6;color:#FFFFFF;">
                              You are on your first step towards a new Hospital.
                            </p>
                            <p style="margin:0 0 26px 0;font-family:Arial,sans-serif;font-size:18px;line-height:1.6;color:#FFFFFF;">
                              Someone from our team will be in contact with you shortly.<br />
                              Or, if you would like to schedule today, use the link below.
                            </p>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td bgcolor="#FFFFFF" style="border-radius:10px;">
                                  <a
                                    href="https://app.acuityscheduling.com/schedule.php?owner=37410694"
                                    style="display:inline-block;padding:14px 22px;font-family:Arial,sans-serif;font-size:16px;line-height:1;color:#0B1B34;text-decoration:none;font-weight:800;"
                                  >
                                    Schedule Now
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="bottom" style="padding:20px 18px 28px 18px;">
                      <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#FFFFFF;">
                        Amplefi OPS LLC • <a href="https://amplefi.com" style="color:#FFFFFF;text-decoration:underline;">https://amplefi.com</a>
                      </p>
                      <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#FFFFFF;">
                        <a href="${unsubscribeUrl}" style="color:#FFFFFF;text-decoration:underline;">Unsubscribe</a>
                      </p>
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#FFFFFF;">
                        If you no longer want to receive emails from Amplefi OPS LLC, unsubscribe here.
                      </p>
                    </td>
                  </tr>
                </table>
                <!--[if gte mso 9]>
                  </v:textbox>
                </v:rect>
                <![endif]-->
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  const text = [
    "Thank you for requesting a Demo with Amplefi.",
    "",
    "You are on your first step towards a new Hospital.",
    "",
    "Someone from our team will be in contact with you shortly.",
    "Or, if you would like to schedule today, use the link below.",
    "Schedule Now: https://app.acuityscheduling.com/schedule.php?owner=37410694",
    "",
    "Amplefi OPS LLC - https://amplefi.com",
    "",
    "Unsubscribe: " + unsubscribeUrl,
    "If you no longer want to receive emails from Amplefi OPS LLC, unsubscribe here.",
  ].join("\n");

  await ses.send(
    new SendEmailCommand({
      Source: process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL,
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: {
          Data: "We got your request",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    })
  );
}

async function sendLeadNotification(details) {
  const toAddresses = getNotifyEmails();
  if (toAddresses.length === 0) return;

  const subject = `New Demo Request — ${details.fullName} (${details.workEmail})`;
  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f7fb;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:#f5f7fb;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:18px 20px;background:#08172f;">
                <div style="font-family:Arial,sans-serif;font-size:18px;line-height:1.3;font-weight:800;color:#ffffff;">New Demo Request</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#111827;">
                  <tr>
                    <td style="padding:10px 0;width:160px;font-weight:700;vertical-align:top;border-bottom:1px solid #eef2f7;">Full Name</td>
                    <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #eef2f7;">${escapeHtml(details.fullName || "")}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;width:160px;font-weight:700;vertical-align:top;border-bottom:1px solid #eef2f7;">Work Email</td>
                    <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #eef2f7;"><a href="mailto:${escapeHtml(details.workEmail || "")}" style="color:#08172f;text-decoration:underline;">${escapeHtml(details.workEmail || "")}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;width:160px;font-weight:700;vertical-align:top;border-bottom:1px solid #eef2f7;">Title</td>
                    <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #eef2f7;">${escapeHtml(details.title || "")}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;width:160px;font-weight:700;vertical-align:top;border-bottom:1px solid #eef2f7;">Organization</td>
                    <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #eef2f7;">${escapeHtml(details.organization || "")}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;width:160px;font-weight:700;vertical-align:top;">Message</td>
                    <td style="padding:10px 0;vertical-align:top;white-space:pre-wrap;">${escapeHtml(details.message || "")}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  const text = [
    "New Demo Request",
    "",
    `Full Name: ${details.fullName || ""}`,
    `Work Email: ${details.workEmail || ""}`,
    `Title: ${details.title || ""}`,
    `Organization: ${details.organization || ""}`,
    "",
    "Message:",
    `${details.message || ""}`,
  ].join("\n");

  await ses.send(
    new SendEmailCommand({
      Source: process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    })
  );
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    // Required fields
    if (!body.fullName || !body.workEmail) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing required fields." }) };
    }

    const workEmail = String(body.workEmail).trim().toLowerCase();
    if (!EMAIL_RE.test(workEmail)) {
      return { statusCode: 400, body: JSON.stringify({ message: "Valid workEmail is required." }) };
    }

    // Honeypot (spam)
    if (body.company_website) {
      return { statusCode: 200, body: JSON.stringify({ message: "OK" }) };
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const item = {
      id: { S: id },
      createdAt: { S: now },

      fullName: { S: String(body.fullName) },
      workEmail: { S: workEmail },
      title: { S: String(body.title || "") },
      organization: { S: String(body.organization || "") },
      message: { S: String(body.message || "") },

      pagePath: { S: String(body.pagePath || "") },
      utm_source: { S: String(body.utm_source || "") },
      utm_medium: { S: String(body.utm_medium || "") },
      utm_campaign: { S: String(body.utm_campaign || "") },
      utm_term: { S: String(body.utm_term || "") },
      utm_content: { S: String(body.utm_content || "") },

      userAgent: { S: String(body.userAgent || "") },
      timestamp: { S: String(body.timestamp || now) },
    };

    await ddb.send(
      new PutItemCommand({
        TableName: process.env.LEADS_TABLE,
        Item: item,
      })
    );

    let shouldSendCustomerEmail = true;
    try {
      const status = await getSubscriberStatus(workEmail);
      if (status === "unsubscribed") {
        shouldSendCustomerEmail = false;
      }
    } catch (suppressionErr) {
      console.error("DynamoDB read error (lead suppression check):", suppressionErr);
    }

    const notificationDetails = {
      fullName: String(body.fullName),
      workEmail,
      title: String(body.title || ""),
      organization: String(body.organization || ""),
      message: String(body.message || ""),
    };

    if (shouldSendCustomerEmail) {
      try {
        await sendAutoReply(workEmail);
      } catch (sesErr) {
        console.error("SES send error (lead auto-reply):", sesErr);
      }
    } else {
      console.log("Skipping lead customer email due to unsubscribe:", workEmail);
    }
    try {
      await sendLeadNotification(notificationDetails);
    } catch (sesErr) {
      console.error("SES send error (lead internal notification):", sesErr);
    }

    return { statusCode: 201, body: JSON.stringify({ message: "Lead stored." }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
