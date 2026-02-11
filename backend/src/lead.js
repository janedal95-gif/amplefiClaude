const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('node:crypto');

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE = process.env.LEADS_TABLE;

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

  // Validate required fields
  const { fullName, workEmail } = body;

  if (!fullName || !fullName.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'fullName is required' }) };
  }

  if (!workEmail || !EMAIL_RE.test(workEmail)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid workEmail is required' }) };
  }

  const item = {
    id: randomUUID(),
    fullName: fullName.trim(),
    workEmail: workEmail.trim().toLowerCase(),
    title: (body.title || '').trim(),
    organization: (body.organization || '').trim(),
    message: (body.message || '').trim(),
    pagePath: body.pagePath || '',
    utm_source: body.utm_source || '',
    utm_medium: body.utm_medium || '',
    utm_campaign: body.utm_campaign || '',
    utm_term: body.utm_term || '',
    utm_content: body.utm_content || '',
    userAgent: body.userAgent || '',
    timestamp: body.timestamp || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  try {
    await dynamo.send(new PutCommand({ TableName: TABLE, Item: item }));
    return { statusCode: 201, body: JSON.stringify({ message: 'Created', id: item.id }) };
  } catch (err) {
    console.error('DynamoDB put error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
