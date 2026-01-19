import type { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { OpenAPIHandler } from "@orpc/openapi/aws-lambda";
import { onError } from "@orpc/server";
import { plugins, router } from "@openauth/orpc/router";

const handlerInstance = new OpenAPIHandler(router, {
	plugins,
	interceptors: [
		onError((error) => {
			console.error("[orpc] handler error", error);
		}),
	],
});

export const handler: Handler<APIGatewayProxyEventV2> = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	const result = await handlerInstance.handle(event, {
		context: {
			headers: event.headers,
		},
	});

	if (result?.response) {
		return result.response;
	}

	return {
		statusCode: 404,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ error: "Not Found" }),
	};
};
