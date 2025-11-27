import {
	Handler,
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
} from "aws-lambda";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/aws-lambda";
import { MockDataGenerator } from "./mock/data/mockData";
import { database, initializeDatabase } from "./mock/data/database";
import { CrmController } from "./mock/controllers/CrmController";
import { DataController } from "./mock/controllers/DataController";
import { ControllerError } from "./mock/controllers/errors";
import {
	DebtorRequest,
	SearchRequest,
	CustomerRequest,
	WrapupRequest,
	StoredProcedureRequest,
} from "@openauth/core/models";

initializeDatabase();
console.log("Seeding initial customers...");
MockDataGenerator.resetCounters();
for (let i = 0; i < 5; i++) {
	const customer = MockDataGenerator.generateCompleteCustomer();
	database.createCustomer(customer);
}
console.log("Database seeded with initial data");
console.log("Database stats:", database.getStats());

const app = new Hono().basePath("/api");

app.use("*", logger());
app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	})
);

app.get(
	"/me",
	(c) => {
		const authHeader = c.req.header("Authorization") ?? "";
		if (!authHeader) return c.json({ error: "Unauthorized" }, 401);
		return c.json({ userId: "123", name: "John Doe" });
	},
);

app.get("/health", (c) => {
	return c.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		service: "CRM Mock API Server",
		version: "1.0.0",
	});
});

const crmController = new CrmController();
const dataController = new DataController();

function handleRoute<T>(
	handler: (body: T) => Promise<any>,
	defaultStatus: number = 400
): (c: any) => Promise<any> {
	return async (c: any) => {
		try {
			const body = (await c.req.json()) as T;
			const result = await handler(body);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof ControllerError) {
				c.status(error.status);
				return c.json({ error: error.message });
			}
			const message =
				error instanceof Error ? error.message : "Unknown error";
			c.status(defaultStatus);
			return c.json({
				error:
					defaultStatus === 500
						? "Internal Server Error"
						: "Bad Request",
				message,
			});
		}
	};
}

app.post(
	"/crm/debtor",
	handleRoute<DebtorRequest>((body) => crmController.getDebtorInfo(body))
);
app.post(
	"/crm/search",
	handleRoute<SearchRequest>((body) => crmController.searchCustomers(body))
);
app.post(
	"/crm/customer",
	handleRoute<CustomerRequest>((body) =>
		crmController.getCustomerDetails(body)
	)
);
app.post(
	"/crm/wrapup",
	handleRoute<WrapupRequest>((body) => crmController.submitWrapup(body))
);
app.post(
	"/data",
	handleRoute<StoredProcedureRequest>(
		(body) => dataController.executeStoredProcedure(body),
		500
	)
);

app.onError((err, c) => {
	console.error("Unhandled error:", err);
	return c.json(
		{
			error: "Internal Server Error",
			message: err.message || "Something went wrong",
		},
		500
	);
});

app.notFound((c) => {
	return c.json(
		{
			error: "Not Found",
			message: `Route ${c.req.method} ${c.req.path} not found`,
		},
		404
	);
});
export const handler = handle(app) as unknown as Handler<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
>;
