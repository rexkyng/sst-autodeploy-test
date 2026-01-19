import express from "express";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { onError } from "@orpc/server";
import { plugins, router } from "@openauth/orpc/router";
import { handler as authHandler } from "../auth";

const handler = new OpenAPIHandler(router, {
	plugins,
	interceptors: [
		onError((error) => {
			console.error("[orpc] express handler error", error);
		}),
	],
});

export function createApp() {
	const app = express();

	// Auth endpoints (issuer)
	app.all("/auth/*", async (req, res) => {
		const url = `${req.originalUrl || req.url}`;
		const request = new Request(url, {
			method: req.method,
			headers: req.headers as Record<string, string>,
			body: req.body,
		});

		const response = await authHandler(
			{
				rawPath: req.path,
				rawQueryString: req.originalUrl.split("?")[1] || "",
				headers: req.headers as Record<string, string>,
				body: req.body,
				isBase64Encoded: false,
				requestContext: {
					http: { method: req.method } as any,
				},
			} as any,
			{} as any,
			() => {},
		);

		if (!response) {
			return res.status(500).json({ error: "Auth handler returned empty response" });
		}

		res.status(response.statusCode);
		if (response.cookies) {
			res.setHeader("Set-Cookie", response.cookies);
		}
		if (response.headers) {
			for (const [k, v] of Object.entries(response.headers)) {
				if (Array.isArray(v)) {
					res.setHeader(k, v);
				} else if (v !== undefined) {
					res.setHeader(k, v);
				}
			}
		}
		res.send(response.body);
	});

	app.all("/api", async (req, res) => {
		const result = await handler.handle(req, res, {
			context: { headers: req.headers },
		});

		if (!result.matched) {
			res.status(404).json({ error: "Not Found" });
		}
	});

	app.all("/api/*", async (req, res) => {
		const result = await handler.handle(req, res, {
			context: { headers: req.headers },
		});

		if (!result.matched) {
			res.status(404).json({ error: "Not Found" });
		}
	});

	return app;
}

if (process.env.NODE_ENV !== "test") {
	const port = Number(process.env.PORT || 3000);
	createApp().listen(port, () => {
		console.log(`oRPC Express server listening on http://localhost:${port}`);
	});
}
