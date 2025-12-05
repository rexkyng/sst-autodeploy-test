import * as fs from "fs";
import * as path from "path";

// Path to the generated OpenAPI spec from TSOA
export const openapiSpecPath = "packages/api/swagger/swagger.json";

// Read the OpenAPI spec as a string (required by AWS API Gateway)
const openapiSpecString = fs.readFileSync(path.resolve(openapiSpecPath), "utf-8");

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