import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { searchCustomers } from '@openauth/core/functions'
import { SearchRequest } from '@openauth/core/models'
import { successResponse, errorResponse, parseBody } from './shared/response'

/**
 * Lambda handler for POST /api/crm/search endpoint
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const request = parseBody<SearchRequest>(event.body)
    const result = await searchCustomers(request)
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}
