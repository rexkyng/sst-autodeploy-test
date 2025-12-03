import {
  Controller,
  Get,
  Route,
  Response,
  Tags,
  SuccessResponse,
  Security,
} from 'tsoa'
import { ErrorResponse } from './types'

interface HealthResponse {
  status: string
  timestamp: string
  service: string
  version: string
}

interface UserResponse {
  userId: string
  name: string
}

@Route('')
@Tags('System')
export class MainController extends Controller {
  /**
   * Health check endpoint
   */
  @Get('health')
  @SuccessResponse('200', 'OK')
  public async getHealth(): Promise<HealthResponse> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'CRM Mock API Server',
      version: '1.0.0',
    }
  }

  /**
   * Get current user information
   * Authentication is handled by API Gateway's JWT authorizer
   */
  @Get('me')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  @Response<ErrorResponse>(401, 'Unauthorized')
  public async getMe(): Promise<UserResponse> {
    // API Gateway validates JWT before this runs
    // In a real implementation, user info would come from the JWT claims
    return {
      userId: '123',
      name: 'John Doe',
    }
  }
}

