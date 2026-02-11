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

const SUBSCRIBE_AUTO_REPLY_HTML = `
<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Amplefi</title>
  </head>
  <body style="margin:0;padding:0;background-color:#08172f;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#08172f;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;">
            <tr>
              <td
                background="https://amplefi.com/AmplefiWater.jpeg"
                bgcolor="#0b1e3d"
                height="420"
                valign="top"
                style="background-image:url('https://amplefi.com/AmplefiWater.jpeg');background-size:cover;background-position:center center;background-repeat:no-repeat;border-radius:10px;overflow:hidden;"
              >
                <!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:420px;">
                  <v:fill type="frame" src="https://amplefi.com/AmplefiWater.jpeg" color="#0b1e3d" />
                  <v:textbox inset="0,0,0,0">
                <![endif]-->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="420" style="height:420px;background-color:rgba(11,30,61,0.72);">
                  <tr>
                    <td valign="middle" align="center" style="padding:36px 36px 22px 36px;">
                      <h1 style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:30px;line-height:1.25;font-weight:700;color:#ffffff;text-shadow:0 1px 2px rgba(0,0,0,0.45);">
                        Thank you for subscribing to Amplefi.
                      </h1>
                      <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#ffffff;text-shadow:0 1px 1px rgba(0,0,0,0.4);">
                        You're now connected to insights, strategy, and innovation shaping the future of hospital operations.
                      </p>
                      <p style="margin:0 0 24px 0;font-family:Arial,sans-serif;font-size:17px;line-height:1.6;color:#ffffff;text-shadow:0 1px 1px rgba(0,0,0,0.4);">
                        We'll share updates, tools, and opportunities to help you build and operate your independent hospital with confidence.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td bgcolor="#ffffff" style="border-radius:5px;">
                            <a
                              href="https://amplefi.com"
                              style="display:inline-block;padding:12px 22px;font-family:Arial,sans-serif;font-size:15px;line-height:1;color:#0b1e3d;text-decoration:none;font-weight:700;"
                            >
                              Visit Amplefi
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
                  <a href="{{UNSUBSCRIBE_URL}}" style="color:#b8c5df;text-decoration:underline;">Unsubscribe</a>
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

const SUBSCRIBE_AUTO_REPLY_TEXT = [
  "Thank you for subscribing to Amplefi.",
  "",
  "You are now connected to insights, strategy, and innovation shaping the future of hospital operations.",
  "",
  "We will be sharing updates, tools, and opportunities to help you build and operate your independent hospital with confidence.",
  "",
  "Visit Amplefi: https://amplefi.com",
  "",
  "Amplefi OPS LLC",
  "https://amplefi.com",
  "",
  "Unsubscribe: {{UNSUBSCRIBE_URL}}",
  "If you no longer want to receive emails from Amplefi OPS LLC, unsubscribe here.",
].join("\n");

async function sendAutoReply(toAddress) {
  const unsubscribeUrl = buildUnsubscribeUrl(toAddress);
  await ses.send(
    new SendEmailCommand({
      Source: process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL,
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: {
          Data: "Welcome to Amplefi",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: SUBSCRIBE_AUTO_REPLY_TEXT.replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl),
            Charset: "UTF-8",
          },
          Html: {
            Data: SUBSCRIBE_AUTO_REPLY_HTML.replace("{{UNSUBSCRIBE_URL}}", unsubscribeUrl),
            Charset: "UTF-8",
          },
        },
      },
    })
  );
}

async function sendSubscribeNotification(details) {
  const toAddresses = getNotifyEmails();
  if (toAddresses.length === 0) return;

  const subject = `New Subscriber — ${details.email}`;
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
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#111827;">New Subscriber</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Email</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.email)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Timestamp</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.timestamp)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#111827;">Page Path</td><td style="padding:8px 0;color:#111827;">${escapeHtml(details.pagePath)}</td></tr>
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
    "New Subscriber",
    "",
    `Email: ${details.email}`,
    `Timestamp: ${details.timestamp}`,
    `Page Path: ${details.pagePath}`,
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

    // Honeypot (spam)
    if (body.company_website) {
      return { statusCode: 200, body: JSON.stringify({ message: "OK" }) };
    }

    if (!body.email) {
      return { statusCode: 400, body: JSON.stringify({ message: "Email is required." }) };
    }

    const email = String(body.email).trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ message: "Valid email is required." }) };
    }

    let existingStatus = "";
    try {
      existingStatus = await getSubscriberStatus(email);
    } catch (suppressionErr) {
      console.error("DynamoDB read error (subscribe suppression check):", suppressionErr);
    }

    const now = new Date().toISOString();

    if (existingStatus !== "unsubscribed") {
      await ddb.send(
        new PutItemCommand({
          TableName: process.env.SUBSCRIBERS_TABLE,
          Item: {
            email: { S: email },
            status: { S: "subscribed" },
            createdAt: { S: now },
            pagePath: { S: String(body.pagePath || "") },
            utm_source: { S: String(body.utm_source || "") },
            utm_medium: { S: String(body.utm_medium || "") },
            utm_campaign: { S: String(body.utm_campaign || "") },
            utm_term: { S: String(body.utm_term || "") },
            utm_content: { S: String(body.utm_content || "") },
            userAgent: { S: String(body.userAgent || "") },
            timestamp: { S: String(body.timestamp || now) },
          },
        })
      );
    } else {
      console.log("Keeping subscriber in unsubscribed state:", email);
    }

    const notificationDetails = {
      email,
      timestamp: String(body.timestamp || now),
      pagePath: String(body.pagePath || ""),
      utm_source: String(body.utm_source || ""),
      utm_medium: String(body.utm_medium || ""),
      utm_campaign: String(body.utm_campaign || ""),
      utm_term: String(body.utm_term || ""),
      utm_content: String(body.utm_content || ""),
      userAgent: String(body.userAgent || ""),
    };

    if (existingStatus !== "unsubscribed") {
      try {
        await sendAutoReply(email);
      } catch (sesErr) {
        console.error("SES send error (subscribe auto-reply):", sesErr);
      }
    } else {
      console.log("Skipping subscribe customer email due to unsubscribe:", email);
    }
    try {
      await sendSubscribeNotification(notificationDetails);
    } catch (sesErr) {
      console.error("SES send error (subscribe internal notification):", sesErr);
    }

    return { statusCode: 201, body: JSON.stringify({ message: "Subscribed." }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
