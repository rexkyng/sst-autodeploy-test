import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { Resource } from "sst";

const apiUrl = `${Resource.MyApiGateway?.url || "http://localhost:3000"}/api`;

/**
 * Lambda handler for GET /api/openapi endpoint
 * Returns the OpenAPI specification
 */
export const handler: Handler<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
> = async () => {
	try {
		const spec = await import("../generated/swagger.json", {
			with: { type: "json" },
		});
		spec.default.servers = [
			...(apiUrl.includes("localhost")
				? [{ url: apiUrl }]
				: [{ url: apiUrl }, { url: "http://localhost:3000/api" }]),
		];

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
			body: JSON.stringify(spec.default || spec),
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
	// Generate HTML using swagger-ui-express library
	let html = `
  <!DOCTYPE html>
  <html>
  <head>
  <title>API Documentation</title>
  </head>
  <body>
  <div id="swagger-ui"></div>
  <redoc spec-url="${apiUrl}/doc/raw"></redoc>
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
