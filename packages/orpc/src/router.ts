import { FunctionError, getHealth, getMe, executeStoredProcedure, getCustomerDetails, getDebtorInfo, searchCustomers, submitWrapup } from "@openauth/core/functions";
import { ORPCError, os } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import {
	CustomerDetailsResponseSchema,
	CustomerInfoSchema,
	CustomerRequestSchema,
	CustomerSearchResponseSchema,
	DebtorRequestSchema,
	ErrorSchema,
	HealthSchema,
	SearchRequestSchema,
	StoredProcedureRequestSchema,
	StoredProcedureResponseSchema,
	UserSchema,
	WrapupRequestSchema,
	WrapupResponseSchema,
} from "./schemas";

const base = os
	.errors({
		BAD_REQUEST: {
			status: 400,
			data: ErrorSchema.partial(),
		},
		NOT_FOUND: {
			status: 404,
			data: ErrorSchema.partial(),
		},
		INTERNAL_SERVER_ERROR: {
			status: 500,
			data: ErrorSchema.partial(),
		},
	})
	.$config({
		// Skip runtime output validation; schemas are kept for OpenAPI generation
		initialOutputValidationIndex: Number.NaN,
	});

function mapFunctionError(error: unknown): ORPCError<"BAD_REQUEST" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR", unknown> {
	if (error instanceof FunctionError) {
		if (error.status === 404) {
			return new ORPCError("NOT_FOUND", { status: 404, message: error.message });
		}
		return new ORPCError("BAD_REQUEST", { status: error.status ?? 400, message: error.message });
	}
	if (error instanceof ORPCError) {
		return error;
	}
	if (error instanceof Error) {
		return new ORPCError("INTERNAL_SERVER_ERROR", { status: 500, message: error.message, cause: error });
	}
	return new ORPCError("INTERNAL_SERVER_ERROR", {
		status: 500,
		message: "Unknown error",
		data: error,
	});
}

const health = base
	.route({ method: "GET", path: "/health", summary: "Health check endpoint" })
	.output(HealthSchema)
	.handler(async () => getHealth());

const me = base
	.route({ method: "GET", path: "/me", summary: "Get current user info" })
	.output(UserSchema)
	.handler(async () => getMe());

const data = base
	.route({ method: "POST", path: "/data", summary: "Execute a stored procedure" })
	.input(StoredProcedureRequestSchema)
	.output(StoredProcedureResponseSchema)
	.handler(async ({ input }) => {
		try {
			return await executeStoredProcedure(input);
		} catch (error) {
			throw mapFunctionError(error);
		}
	});

const crmDebtor = base
	.route({ method: "POST", path: "/crm/debtor", summary: "Get debtor information" })
	.input(DebtorRequestSchema)
	.output(CustomerInfoSchema)
	.handler(async ({ input }) => {
		try {
			return await getDebtorInfo(input);
		} catch (error) {
			throw mapFunctionError(error);
		}
	});

const crmSearch = base
	.route({ method: "POST", path: "/crm/search", summary: "Search customers" })
	.input(SearchRequestSchema)
	.output(CustomerSearchResponseSchema)
	.handler(async ({ input }) => {
		try {
			return await searchCustomers(input);
		} catch (error) {
			throw mapFunctionError(error);
		}
	});

const crmCustomer = base
	.route({ method: "POST", path: "/crm/customer", summary: "Get customer details" })
	.input(CustomerRequestSchema)
	.output(CustomerDetailsResponseSchema)
	.handler(async ({ input }) => {
		try {
			return await getCustomerDetails(input);
		} catch (error) {
			throw mapFunctionError(error);
		}
	});

const crmWrapup = base
	.route({ method: "POST", path: "/crm/wrapup", summary: "Submit wrapup" })
	.input(WrapupRequestSchema)
	.output(WrapupResponseSchema)
	.handler(async ({ input }) => {
		try {
			return await submitWrapup(input);
		} catch (error) {
			throw mapFunctionError(error);
		}
	});

export const router = os.prefix("/api").router({
	health,
	me,
	data,
	crm: os.router({
		debtor: crmDebtor,
		search: crmSearch,
		customer: crmCustomer,
		wrapup: crmWrapup,
	}),
});

export const plugins = [new CORSPlugin()];

export type Router = typeof router;
