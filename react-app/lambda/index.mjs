import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient();

const TO_ADDRESS = "jane.dalesandro@amplefi.com";
const FROM_ADDRESS = process.env.FROM_ADDRESS || "noreply@amplefi.com";

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  try {
    const body = JSON.parse(event.body);
    const { name, position, worry } = body;

    if (!name || !position || !worry) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "All fields are required." }),
      };
    }

    const command = new SendEmailCommand({
      Source: FROM_ADDRESS,
      Destination: { ToAddresses: [TO_ADDRESS] },
      Message: {
        Subject: { Data: `Demo Request — ${name}` },
        Body: {
          Text: {
            Data: [
              `Name: ${name}`,
              `Position: ${position}`,
              ``,
              `Biggest Worry:`,
              worry,
            ].join("\n"),
          },
        },
      },
    });

    await ses.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Sent successfully." }),
    };
  } catch (err) {
    console.error("SES send error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to send. Please try again." }),
    };
  }
};
