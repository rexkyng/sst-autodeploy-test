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

// API routes - per-endpoint Lambda handlers with TSOA

// CORS preflight handlers (no auth required)
// apigateway.route("OPTIONS /api/crm/debtor", {
// 	handler: "packages/functions/src/handlers/debtor.handler",
// 	link: [apigateway, auth, cognitoClient],
// });
// apigateway.route("OPTIONS /api/crm/search", {
// 	handler: "packages/functions/src/handlers/search.handler",
// 	link: [apigateway, auth, cognitoClient],
// });
// apigateway.route("OPTIONS /api/crm/customer", {
// 	handler: "packages/functions/src/handlers/customer.handler",
// 	link: [apigateway, auth, cognitoClient],
// });
// apigateway.route("OPTIONS /api/crm/wrapup", {
// 	handler: "packages/functions/src/handlers/wrapup.handler",
// 	link: [apigateway, auth, cognitoClient],
// });
// apigateway.route("OPTIONS /api/data", {
// 	handler: "packages/functions/src/handlers/data.handler",
// 	link: [apigateway, auth, cognitoClient],
// });
// apigateway.route("OPTIONS /api/health", {
// 	handler: "packages/functions/src/handlers/health.handler",
// 	link: [apigateway, auth, cognitoClient],
// });
// apigateway.route("OPTIONS /api/me", {
// 	handler: "packages/functions/src/handlers/health.handler",
// 	link: [apigateway, auth, cognitoClient],
// });

// CRM endpoints (authenticated)
apigateway.route(
	"POST /api/crm/debtor",
	{
		handler: "packages/functions/src/handlers/debtor.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);
apigateway.route(
	"POST /api/crm/search",
	{
		handler: "packages/functions/src/handlers/search.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);
apigateway.route(
	"POST /api/crm/customer",
	{
		handler: "packages/functions/src/handlers/customer.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);
apigateway.route(
	"POST /api/crm/wrapup",
	{
		handler: "packages/functions/src/handlers/wrapup.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);

// Data endpoint (authenticated)
apigateway.route(
	"POST /api/data",
	{
		handler: "packages/functions/src/handlers/data.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);

// Public endpoints
apigateway.route("GET /api/health", {
	handler: "packages/functions/src/handlers/health.handler",
	link: [apigateway, auth, cognitoClient],
});

// User info endpoint (authenticated)
apigateway.route(
	"GET /api/me",
	{
		handler: "packages/functions/src/handlers/health.handler",
		link: [apigateway, auth, cognitoClient],
	},
	{
		auth: {
			lambda: jwtAuthorizer.id,
		},
	},
);

// API documentation endpoint (public) - serves raw OpenAPI spec
apigateway.route("GET /api/doc", {
	handler: "packages/functions/src/handlers/openapi.handler",
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
