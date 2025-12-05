import { APIGatewayProxyResult } from 'aws-lambda'
import { FunctionError } from '@openauth/core/functions'

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function successResponse(body: unknown, statusCode = 200): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  }
}

export function errorResponse(error: unknown): APIGatewayProxyResult {
  if (error instanceof FunctionError) {
    return {
      statusCode: error.status,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: error.status === 500 ? 'Internal Server Error' : 'Bad Request',
        message: error.message,
      }),
    }
  }

  const message = error instanceof Error ? error.message : 'Unknown error'
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      error: 'Internal Server Error',
      message,
    }),
  }
}

export function parseBody<T>(body: string | null): T {
  try {
    return JSON.parse(body || '{}') as T
  } catch {
    return {} as T
  }
}
