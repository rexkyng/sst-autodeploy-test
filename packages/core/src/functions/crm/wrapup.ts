import {
  WrapupRequest,
  WrapupResponse,
} from '../../models'
import { FunctionError } from '../errors'
import { ensureDatabaseInitialized } from '../database-init'

/**
 * Submit wrapup data after a call
 */
export async function submitWrapup(request: WrapupRequest): Promise<WrapupResponse> {
  ensureDatabaseInitialized()

  try {
    if (!request.CallInfo.CallResultCodeId) {
      throw new FunctionError(400, 'CallResultCodeId is required')
    }

    return {
      success: true,
      message: 'Wrap-up data processed successfully',
      processedAt: new Date().toISOString(),
      accountsProcessed: request.CallInfo.Accounts.length,
    }
  } catch (error) {
    if (error instanceof FunctionError) {
      throw error
    }
    throw new FunctionError(400, 'Invalid wrap-up data')
  }
}
