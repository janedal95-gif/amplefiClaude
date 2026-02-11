const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const ddb = new DynamoDBClient({});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.email) {
      return { statusCode: 400, body: JSON.stringify({ message: "Email is required." }) };
    }

    // Honeypot (spam)
    if (body.company_website) {
      return { statusCode: 200, body: JSON.stringify({ message: "OK" }) };
    }

    const email = String(body.email).toLowerCase();
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

    return { statusCode: 201, body: JSON.stringify({ message: "Subscribed." }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
