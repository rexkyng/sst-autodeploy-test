import {
  Controller,
  Get,
  Route,
  Response,
  Tags,
  SuccessResponse,
  Security,
} from 'tsoa'
import {
  getHealth,
  getMe,
  HealthResponse,
  UserResponse,
} from '@openauth/core/functions'
import { ErrorResponse } from './types'

@Route('')
@Tags('System')
export class MainController extends Controller {
  /**
   * Health check endpoint
   */
  @Get('health')
  @SuccessResponse('200', 'OK')
  public async getHealthEndpoint(): Promise<HealthResponse> {
    return getHealth()
  }

  /**
   * Get current user information
   * Authentication is handled by API Gateway's JWT authorizer
   */
  @Get('me')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  @Response<ErrorResponse>(401, 'Unauthorized')
  public async getMeEndpoint(): Promise<UserResponse> {
    return getMe()
  }
}

