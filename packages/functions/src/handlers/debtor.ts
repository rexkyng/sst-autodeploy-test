import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getDebtorInfo } from '@openauth/core/functions'
import { DebtorRequest } from '@openauth/core/models'
import { successResponse, errorResponse, parseBody } from './shared/response'

/**
 * Lambda handler for POST /api/crm/debtor endpoint
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const request = parseBody<DebtorRequest>(event.body)
    const result = await getDebtorInfo(request)
    return successResponse(result)
  } catch (error) {
    return errorResponse(error)
  }
}
