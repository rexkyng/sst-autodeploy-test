import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getHealth, getMe } from '@openauth/core/functions'
import { successResponse, errorResponse } from './shared/response'

/**
 * Lambda handler for GET /api/health endpoint
 */
export const healthHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const result = await getHealth()
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * Lambda handler for GET /api/me endpoint
 */
export const meHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const result = await getMe()
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}

// Default export for backwards compatibility
export const handler = healthHandler
