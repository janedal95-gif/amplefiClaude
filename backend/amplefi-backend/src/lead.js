const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const crypto = require("crypto");

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
          Data: "We got your request",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: "Thanks for requesting a demo — we’ll be in touch shortly!",
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

    try {
      await sendAutoReply(workEmail);
    } catch (sesErr) {
      console.error("SES send error (lead auto-reply):", sesErr);
    }

    return { statusCode: 201, body: JSON.stringify({ message: "Lead stored." }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
