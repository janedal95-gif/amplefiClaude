const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE = process.env.SUBSCRIBERS_TABLE;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Honeypot — accept silently, do not store
  if (body.company_website) {
    return { statusCode: 200, body: JSON.stringify({ message: 'OK' }) };
  }

  // Validate email
  const { email } = body;

  if (!email || !EMAIL_RE.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid email is required' }) };
  }

  const item = {
    email: email.trim().toLowerCase(),
    status: 'subscribed',
    pagePath: body.pagePath || '',
    utm_source: body.utm_source || '',
    utm_medium: body.utm_medium || '',
    utm_campaign: body.utm_campaign || '',
    utm_term: body.utm_term || '',
    utm_content: body.utm_content || '',
    userAgent: body.userAgent || '',
    timestamp: body.timestamp || new Date().toISOString(),
    subscribedAt: new Date().toISOString(),
  };

  try {
    await dynamo.send(new PutCommand({ TableName: TABLE, Item: item }));
    return { statusCode: 201, body: JSON.stringify({ message: 'Subscribed' }) };
  } catch (err) {
    console.error('DynamoDB put error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
