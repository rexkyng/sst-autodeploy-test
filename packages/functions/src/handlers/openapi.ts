import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { Resource } from "sst";

const apiGatewayUrl = Resource.MyApiGateway?.url;
const apiUrls = [
	...(apiGatewayUrl ? [{ url: apiGatewayUrl + "/api" }] : []),
	{ url: "http://localhost:3000/api" }
]

/**
 * Lambda handler for GET /api/openapi endpoint
 * Returns the OpenAPI specification
 */
export const handler: Handler<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
> = async () => {
	try {
		const spec = await import("@openauth/api/openapi.json", {
			with: { type: "json" },
		});
		const document = spec.default || spec;
		document.servers = apiUrls;

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
			body: JSON.stringify(document),
		};
	} catch (error) {
		console.error("Error loading OpenAPI spec:", error);
		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
			body: JSON.stringify({
				error: "Failed to load OpenAPI specification",
			}),
		};
	}
};

/**
 * Lambda handler for GET /api/doc/ui endpoint
 * Returns the Swagger UI HTML page
 */
export const uiHandler: Handler<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
> = async () => {
	const docBase = apiGatewayUrl || "http://localhost:3000";
	let html = `
  <!DOCTYPE html>
  <html>
  <head>
  <title>API Documentation</title>
  </head>
  <body>
  <div id="swagger-ui"></div>
  <redoc spec-url="${docBase}/api/doc/raw"></redoc>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
  </html>
  `;

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "text/html",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		body: html,
	};
};


export const helloWorldHandler: Handler<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
> = async () => {
	return {
		statusCode: 200,
		body: "Hello World",
	};
};