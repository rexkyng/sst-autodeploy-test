import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { submitWrapup } from '@openauth/core/functions'
import { WrapupRequest } from '@openauth/core/models'
import { successResponse, errorResponse, parseBody } from './shared/response'

/**
 * Lambda handler for POST /api/crm/wrapup endpoint
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const request = parseBody<WrapupRequest>(event.body)
    const result = await submitWrapup(request)
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}
