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
  <body style="margin:0;padding:0;background-color:#08172f;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#08172f;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;">
            <tr>
              <td
                background="${HERO_IMAGE_URL}"
                bgcolor="#0b1e3d"
                height="420"
                valign="top"
                style="background-image:url('${HERO_IMAGE_URL}');background-size:cover;background-position:center center;background-repeat:no-repeat;border-radius:10px;overflow:hidden;"
              >
                <!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:420px;">
                  <v:fill type="frame" src="${HERO_IMAGE_URL}" color="#0b1e3d" />
                  <v:textbox inset="0,0,0,0">
                <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="420" style="height:420px;background-color:rgba(11,30,61,0.72);">
                  <tr>
                    <td valign="middle" align="center" style="padding:36px 36px 22px 36px;">
                      <h1 style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:30px;line-height:1.25;font-weight:700;color:#ffffff;text-shadow:0 1px 2px rgba(0,0,0,0.45);">
                        Thank you for requesting a Demo with Amplefi.
                      </h1>
                      <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#ffffff;text-shadow:0 1px 1px rgba(0,0,0,0.4);">
                        You are on your first step towards a new Hospital.
                      </p>
                      <p style="margin:0 0 24px 0;font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#ffffff;text-shadow:0 1px 1px rgba(0,0,0,0.4);">
                        Someone from our team will be in contact with you shortly.<br />
                        Or, if you would like to schedule today, use the link below.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td bgcolor="#ffffff" style="border-radius:5px;">
                            <a
                              href="https://app.acuityscheduling.com/schedule.php?owner=37410694"
                              style="display:inline-block;padding:12px 22px;font-family:Arial,sans-serif;font-size:15px;line-height:1;color:#0b1e3d;text-decoration:none;font-weight:700;"
                            >
                              Schedule Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if gte mso 9]>
                  </v:textbox>
                </v:rect>
                <![endif]-->
              </td>
            </tr>
            <tr>
              <td style="padding:18px 10px 4px 10px;text-align:center;">
                <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:13px;color:#d7dfef;">
                  Amplefi OPS LLC • <a href="https://amplefi.com" style="color:#d7dfef;">https://amplefi.com</a>
                </p>
                <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:12px;color:#b8c5df;">
                  <a href="${unsubscribeUrl}" style="color:#b8c5df;text-decoration:underline;">Unsubscribe</a>
                </p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#b8c5df;">
                  If you no longer want to receive emails from Amplefi OPS LLC, unsubscribe here.
                </p>
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
  <body style="margin:0;padding:24px;background:#f5f7fb;color:#111827;font-family:Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
      <tr>
        <td style="padding:20px 24px 8px 24px;">
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#111827;">New Demo Request</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Full Name</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.fullName)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Work Email</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.workEmail)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Title</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.title)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Organization</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.organization)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Message</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.message)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Page Path</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.pagePath)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Timestamp</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.timestamp)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">UTM Source</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.utm_source)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">UTM Medium</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.utm_medium)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">UTM Campaign</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.utm_campaign)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">UTM Term</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.utm_term)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">UTM Content</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.utm_content)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">User Agent</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.userAgent)}</td></tr>
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
    `Full Name: ${details.fullName}`,
    `Work Email: ${details.workEmail}`,
    `Title: ${details.title}`,
    `Organization: ${details.organization}`,
    `Message: ${details.message}`,
    `Page Path: ${details.pagePath}`,
    `Timestamp: ${details.timestamp}`,
    `UTM Source: ${details.utm_source}`,
    `UTM Medium: ${details.utm_medium}`,
    `UTM Campaign: ${details.utm_campaign}`,
    `UTM Term: ${details.utm_term}`,
    `UTM Content: ${details.utm_content}`,
    `User Agent: ${details.userAgent}`,
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
      pagePath: String(body.pagePath || ""),
      timestamp: String(body.timestamp || now),
      utm_source: String(body.utm_source || ""),
      utm_medium: String(body.utm_medium || ""),
      utm_campaign: String(body.utm_campaign || ""),
      utm_term: String(body.utm_term || ""),
      utm_content: String(body.utm_content || ""),
      userAgent: String(body.userAgent || ""),
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
