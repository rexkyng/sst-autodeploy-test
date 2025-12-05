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
  getDebtorInfo,
  searchCustomers,
  getCustomerDetails,
  submitWrapup,
  FunctionError,
} from '@openauth/core/functions'
import {
  CustomerDetails,
  CustomerInfo,
  CustomerSearchResponse,
  WrapupResponse,
  CustomerDetailsResponse,
  DebtorRequest,
  SearchRequest,
  CustomerRequest,
  WrapupRequest,
} from '@openauth/core/models'
import { ControllerError } from './errors'
import { ErrorResponse } from './types'

@Route('crm')
@Tags('CRM')
@Security('jwt')
export class CrmController extends Controller {
  /**
   * Get debtor information by national ID
   */
  @Post('debtor')
  @SuccessResponse('200', 'Success')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  public async getDebtorInfoEndpoint(
    @Body() request: DebtorRequest,
  ): Promise<CustomerInfo> {
    try {
      return await getDebtorInfo(request)
    } catch (error) {
      if (error instanceof FunctionError) {
        this.setStatus(error.status)
        throw new ControllerError(error.status, error.message)
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      this.setStatus(400)
      throw new ControllerError(400, errorMessage)
    }
  }

  /**
   * Search customers by various criteria
   */
  @Post('search')
  @SuccessResponse('200', 'Success')
  @Response<ErrorResponse>(400, 'Bad Request')
  public async searchCustomersEndpoint(
    @Body() request: SearchRequest,
  ): Promise<CustomerSearchResponse> {
    try {
      return await searchCustomers(request)
    } catch (error) {
      if (error instanceof FunctionError) {
        this.setStatus(error.status)
        throw new ControllerError(error.status, error.message)
      }
      this.setStatus(400)
      throw new ControllerError(400, 'Invalid search parameters')
    }
  }

  /**
   * Get full customer details by national ID
   */
  @Post('customer')
  @SuccessResponse('200', 'Success')
  @Response<ErrorResponse>(400, 'Bad Request')
  @Response<ErrorResponse>(404, 'Not Found')
  public async getCustomerDetailsEndpoint(
    @Body() request: CustomerRequest,
  ): Promise<CustomerDetailsResponse> {
    try {
      return await getCustomerDetails(request)
    } catch (error) {
      if (error instanceof FunctionError) {
        this.setStatus(error.status)
        throw new ControllerError(error.status, error.message)
      }
      this.setStatus(400)
      throw new ControllerError(400, 'Invalid request parameters')
    }
  }

  /**
   * Submit wrapup data after a call
   */
  @Post('wrapup')
  @SuccessResponse('200', 'Success')
  @Response<ErrorResponse>(400, 'Bad Request')
  public async submitWrapupEndpoint(
    @Body() request: WrapupRequest,
  ): Promise<WrapupResponse> {
    try {
      return await submitWrapup(request)
    } catch (error) {
      if (error instanceof FunctionError) {
        this.setStatus(error.status)
        throw new ControllerError(error.status, error.message)
      }
      this.setStatus(400)
      throw new ControllerError(400, 'Invalid wrap-up data')
    }
  }
}

