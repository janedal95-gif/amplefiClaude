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
  <body style="margin:0;padding:0;background-color:#0B1B34;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:#0B1B34;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td align="center" style="padding:0;margin:0;background-color:#0B1B34;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;mso-table-lspace:0pt;mso-table-rspace:0pt;">
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
                    <td align="center" valign="top" style="padding:56px 22px 24px 22px;">
                      <h1 style="margin:0 0 18px 0;font-family:Arial,sans-serif;font-size:32px;line-height:1.25;font-weight:800;color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.6);">
                        Thank you for subscribing to Amplefi.
                      </h1>
                      <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:18px;line-height:1.6;color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.6);">
                        You're now connected to insights, strategy, and innovation shaping the future of hospital operations.
                      </p>
                      <p style="margin:0 0 26px 0;font-family:Arial,sans-serif;font-size:18px;line-height:1.6;color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.6);">
                        We'll share updates, tools, and opportunities to help you build and operate your independent hospital with confidence.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td bgcolor="#0B1B34" style="border-radius:6px;">
                            <a
                              href="https://amplefi.com"
                              style="display:inline-block;padding:14px 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1;color:#FFFFFF;text-decoration:none;font-weight:800;"
                            >
                              Visit Amplefi
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="bottom" style="padding:24px 18px 28px 18px;">
                      <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.6);">
                        Amplefi OPS LLC • <a href="https://amplefi.com" style="color:#FFFFFF;text-decoration:underline;">https://amplefi.com</a>
                      </p>
                      <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.6);">
                        <a href="{{UNSUBSCRIBE_URL}}" style="color:#FFFFFF;text-decoration:underline;">Unsubscribe</a>
                      </p>
                      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#FFFFFF;text-shadow:0 2px 6px rgba(0,0,0,0.6);">
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
  <body style="margin:0;padding:0;background:#f5f7fb;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:#f5f7fb;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:18px 20px;background:#08172f;">
                <div style="font-family:Arial,sans-serif;font-size:18px;line-height:1.3;font-weight:800;color:#ffffff;">New Subscriber</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#111827;">
                  <tr>
                    <td style="padding:10px 0;width:160px;font-weight:700;vertical-align:top;">Email</td>
                    <td style="padding:10px 0;vertical-align:top;"><a href="mailto:${escapeHtml(details.email || "")}" style="color:#08172f;text-decoration:underline;">${escapeHtml(details.email || "")}</a></td>
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
    "New Subscriber",
    "",
    `Email: ${details.email || ""}`,
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
