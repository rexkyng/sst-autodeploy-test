import * as fs from "fs";
import * as path from "path";

// Path to the OpenAPI spec generated from oRPC
export const openapiSpecPath = "packages/api/openapi.json";

// Read the OpenAPI spec as a string (required by AWS API Gateway)
const openapiSpecString = fs.readFileSync(
	path.resolve(openapiSpecPath),
	"utf-8"
);

export const apigateway = new sst.aws.ApiGatewayV2("MyApiGateway", {
	cors: {
		allowHeaders: ["Authorization", "Content-Type"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowOrigins: ["*"], // In production, replace with specific origins and enable allowCredentials if needed
		maxAge: "1 day",
	},
	// transform: {
	// 	api: {
	// 		// Import the OpenAPI specification for API Gateway documentation
	// 		body: openapiSpecString,
	// 	},
	// },
});

// API documentation endpoint (public) - serves raw OpenAPI spec
apigateway.route("GET /api/doc/raw", {
	handler: "packages/functions/src/handlers/openapi.handler",
	link: [apigateway],
});

apigateway.route("GET /api/doc", {
	handler: "packages/functions/src/handlers/openapi.uiHandler",
	link: [apigateway],
});

// Other routes and auth config are handled in the auth.ts file

// Link to external API Gateway (if configured)
// const externalApiGatewayId =
// 	process.env.EXTERNAL_API_GATEWAY_ID || "ekqql84h0a";

// if (externalApiGatewayId) {
// 	// Create HTTP_PROXY integration on external gateway pointing to internal gateway
// 	const proxyIntegration = new aws.apigatewayv2.Integration(
// 		"ExternalToInternalIntegration",
// 		{
// 			apiId: externalApiGatewayId,
// 			integrationType: "HTTP_PROXY",
// 			integrationMethod: "ANY",
// 			integrationUri: $concat(apigateway.url, "{proxy}"),
// 			payloadFormatVersion: "1.0",
// 		}
// 	);

// 	// Add catch-all route on external gateway
// 	new aws.apigatewayv2.Route("ExternalProxyRoute", {
// 		apiId: externalApiGatewayId,
// 		routeKey: "ANY /{proxy+}",
// 		target: $concat("integrations/", proxyIntegration.id),
// 	});

// }
