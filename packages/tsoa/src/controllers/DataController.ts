import {
  Body,
  Controller,
  Post,
  Route,
  Response,
  Tags,
  SuccessResponse,
  Security,
} from 'tsoa'
import {
  executeStoredProcedure,
  FunctionError,
} from '@openauth/core/functions'
import {
  StoredProcedureRequest,
  StoredProcedureResponse,
} from '@openauth/core/models'
import { ControllerError } from './errors'
import { ErrorResponse } from './types'

@Route('data')
@Tags('Data')
@Security('jwt')
export class DataController extends Controller {
  /**
   * Execute a stored procedure
   */
  @Post()
  @SuccessResponse('200', 'Success')
  @Response<ErrorResponse>(500, 'Internal Server Error')
  public async executeStoredProcedureEndpoint(
    @Body() request: StoredProcedureRequest,
  ): Promise<StoredProcedureResponse> {
    try {
      return await executeStoredProcedure(request)
    } catch (error) {
      console.error('Error executing stored procedure:', error)
      if (error instanceof FunctionError) {
        this.setStatus(error.status)
        throw new ControllerError(error.status, error.message)
      }
      this.setStatus(500)
      throw new ControllerError(500, 'Internal server error')
    }
  }
}

