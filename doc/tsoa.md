# TSOA with Lambda Implementation

## Overview

TSOA generates OpenAPI specs and Express routes from TypeScript decorators. This project adapts TSOA to run on AWS Lambda via API Gateway, where each route maps to a separate Lambda handler.

## Architecture

1. **Build time**: TSOA generates `routes.ts` and `swagger.json` from controller decorators
2. **Runtime**: Express app wraps TSOA routes using `RegisterRoutes()`
3. **Lambda layer**: `serverless-http` converts API Gateway events to Express requests
4. **API Gateway**: Routes requests to specific Lambda handlers

## Multiple Handlers Pattern

Each API Gateway route points to a separate handler file. Most handlers share the same Express app wrapper:

- **Shared handlers**: `main.ts`, `customer.ts`, `debtor.ts`, `data.ts`, `search.ts`, `wrapup.ts` all export the same handler from `shared/wrapper.ts`
- **Custom handlers**: `openapi.ts` serves the OpenAPI spec directly
- **Benefits**: Independent scaling, better cold starts, route-specific configuration

## Key Files

- `tsoa.json` - TSOA configuration
- `src/app.ts` - Exports controllers for TSOA discovery
- `src/handlers/shared/app.ts` - Creates Express app with TSOA routes
- `src/handlers/shared/wrapper.ts` - Lambda handler using serverless-http (cached app instance)
- `src/handlers/*.ts` - Individual route handlers
- `src/generated/routes.ts` - Auto-generated route registration
- `src/generated/swagger.json` - Auto-generated OpenAPI spec

## Lambda Adaptations

- **App caching**: Express app instance cached for warm Lambda invocations
- **Event loop**: `callbackWaitsForEmptyEventLoop = false` for better performance
- **OpenAPI endpoint**: Separate Lambda handler, not served by Express
- **Authentication**: Handled by API Gateway authorizer, not Express middleware
- **CORS**: Configured at API Gateway level

## Differences from Standalone TSOA

| Aspect | Standalone TSOA | Lambda TSOA |
|--------|----------------|-------------|
| **Deployment** | Long-running Express server | Multiple Lambda functions |
| **Request handling** | Direct HTTP connections | API Gateway → Lambda events |
| **Authentication** | Express middleware | API Gateway authorizer |
| **OpenAPI spec** | Express route | Separate Lambda handler |
| **Cold starts** | One-time server startup | Per-function cold starts (mitigated by caching) |
| **Scaling** | Manual/platform-managed | Automatic, per-function |
| **State** | Can maintain in-memory state | Stateless (externalize state) |

## Build Commands

```bash
bun run tsoa:spec    # Generate OpenAPI spec
bun run tsoa:routes  # Generate route registration
bun run tsoa:build   # Generate both
```
