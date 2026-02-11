const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const ddb = new DynamoDBClient({});
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderHtmlPage(message, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Amplefi Unsubscribe</title>
  </head>
  <body style="margin:0;padding:32px;background:#f5f7fb;color:#111827;font-family:Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:520px;margin:40px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;">
      <tr>
        <td style="padding:30px 24px;text-align:center;">
          <h1 style="margin:0 0 10px 0;font-size:24px;line-height:1.3;color:#111827;">${message}</h1>
          <p style="margin:0;font-size:14px;color:#4b5563;">Amplefi OPS LLC</p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

function buildUnsubscribeToken(email) {
  const secret = process.env.UNSUB_SECRET || "";
  return crypto
    .createHmac("sha256", secret)
    .update(email)
    .digest("base64url");
}

function tokensMatch(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const email = String(query.email || "").trim().toLowerCase();
    const token = String(query.token || "").trim();

    if (!email || !token || !EMAIL_RE.test(email)) {
      return renderHtmlPage("Invalid unsubscribe link.", 400);
    }

    const expectedToken = buildUnsubscribeToken(email);
    if (!tokensMatch(token, expectedToken)) {
      return renderHtmlPage("Invalid unsubscribe link.", 400);
    }

    await ddb.send(
      new UpdateItemCommand({
        TableName: process.env.SUBSCRIBERS_TABLE,
        Key: {
          email: { S: email },
        },
        UpdateExpression: "SET #status = :status, unsubscribedAt = :unsubscribedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": { S: "unsubscribed" },
          ":unsubscribedAt": { S: new Date().toISOString() },
        },
      })
    );

    return renderHtmlPage("You have been unsubscribed.", 200);
  } catch (err) {
    console.error("Unsubscribe handler error:", err);
    return renderHtmlPage("Invalid unsubscribe link.", 400);
  }
};
