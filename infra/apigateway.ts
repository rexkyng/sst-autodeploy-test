export const apigateway = new sst.aws.ApiGatewayV2("MyApiGateway", {
	cors: {
		allowHeaders: ["Authorization", "Content-Type"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowOrigins: ["*"], // In production, replace with specific origins and enable allowCredentials if needed
		maxAge: "1 day",
	},
});

// Other routes and auth config are handled in the auth.ts file