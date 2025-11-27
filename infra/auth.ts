import { userPool, cognitoClient } from "./cognito";
import { apigateway } from "./apigateway";

export const auth = new sst.aws.Auth("MyAuth", {
  issuer: {
    handler: "packages/functions/src/auth.handler",
    link: [userPool, cognitoClient],
	environment: {
		COGNITO_CLIENT_ID: cognitoClient.id,
		COGNITO_CLIENT_SECRET: cognitoClient.secret,
	},
  },
});

// Create Lambda authorizer
const jwtAuthorizer = apigateway.addAuthorizer({
	name: "JwtAuthorizer",
	lambda: {
		function: {
			handler: "packages/functions/src/auth.authorizerHandler",
			link: [apigateway, auth, cognitoClient],
		},
		identitySources: ["$request.header.Authorization"],
		payload: "2.0",
		response: "simple",
		ttl: "300 seconds",
	},
});

// API routes - more specific routes are matched first
// Handle OPTIONS requests separately to bypass authorizer for CORS preflight
apigateway.route("OPTIONS /api/{proxy+}", {
	handler: "packages/functions/src/api.handler",
	link: [apigateway, auth, cognitoClient],
});

apigateway.route(
	"ANY /api/{proxy+}",
	{
		handler: "packages/functions/src/api.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);

apigateway.route("GET /api/openapi", {
	handler: "packages/functions/src/api.handler",
	link: [apigateway, auth, cognitoClient],
});

// Catch-all route - everything else (not under /api) goes to auth
// This handles any other auth endpoints we might have missed
apigateway.route("OPTIONS /{proxy+}", {
	handler: "packages/functions/src/auth.handler",
	link: [apigateway, auth, cognitoClient],
});

apigateway.route("ANY /{proxy+}", {
	handler: "packages/functions/src/auth.handler",
	link: [apigateway, auth, cognitoClient],
});
