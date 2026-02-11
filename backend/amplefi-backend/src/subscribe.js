const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ddb = new DynamoDBClient({});
const ses = new SESClient({ region: "us-east-1" });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM_EMAIL = "hello@amplefi.com";

async function sendAutoReply(toAddress) {
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
            Data: "Thanks for subscribing to Amplefi!",
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

    const now = new Date().toISOString();

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

    try {
      await sendAutoReply(email);
    } catch (sesErr) {
      console.error("SES send error (subscribe auto-reply):", sesErr);
    }

    return { statusCode: 201, body: JSON.stringify({ message: "Subscribed." }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
