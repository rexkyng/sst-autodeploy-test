# OpenAuth

Serverless monorepo powered by SST with oRPC-based HTTP APIs, shared core logic, and a generated OpenAPI spec/client.

## Quick start

```bash
bun install
# regenerate spec + client
bun run generate:openapi && bun run generate:client
# local dev (Lambda-first)
bun run dev
```

## Packages

- `packages/core`: shared domain logic and models
- `packages/orpc`: oRPC router + OpenAPI generation
- `packages/functions`: Lambda + Express adapters that import the oRPC router
- `packages/api`: generated TypeScript client from the OpenAPI spec

## Docs

- OpenAPI: `/api/doc/raw`
- Redoc UI: `/api/doc`
