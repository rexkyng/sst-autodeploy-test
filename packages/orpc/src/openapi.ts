import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { router } from "./router";

const generator = new OpenAPIGenerator({
	schemaConverters: [new ZodToJsonSchemaConverter()],
});

function resolveOutputPath() {
	const dirname = path.dirname(new URL(import.meta.url).pathname);
	return path.resolve(dirname, "../../api/openapi.json");
}

async function build() {
	const gatewayUrl = process.env.API_GATEWAY_URL;
	const servers = [
		gatewayUrl ? { url: `${gatewayUrl}/api` } : null,
		{ url: "http://localhost:3000/api" },
	].filter(Boolean) as { url: string }[];

	const spec = await generator.generate(router, {
		info: {
			title: "OpenAuth API",
			version: process.env.npm_package_version ?? "0.0.0",
		},
		servers,
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [{ bearerAuth: [] }],
	});

	const outputPath = resolveOutputPath();
	await mkdir(path.dirname(outputPath), { recursive: true });
	await writeFile(outputPath, JSON.stringify(spec, null, 2), "utf-8");
	console.log(`OpenAPI spec written to ${outputPath}`);
}

await build();
