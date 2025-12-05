import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getCustomerDetails } from '@openauth/core/functions'
import { CustomerRequest } from '@openauth/core/models'
import { successResponse, errorResponse, parseBody } from './shared/response'

/**
 * Lambda handler for POST /api/crm/customer endpoint
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const request = parseBody<CustomerRequest>(event.body)
    const result = await getCustomerDetails(request)
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}
