import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { executeStoredProcedure } from '@openauth/core/functions'
import { StoredProcedureRequest } from '@openauth/core/models'
import { successResponse, errorResponse, parseBody } from './shared/response'

/**
 * Lambda handler for POST /api/data endpoint
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const request = parseBody<StoredProcedureRequest>(event.body)
    const result = await executeStoredProcedure(request)
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}
