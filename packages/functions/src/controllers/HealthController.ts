import {
  Controller,
  Get,
  Route,
  Response,
  Tags,
  SuccessResponse,
  Request,
  Header,
  Security,
} from 'tsoa'
import express from 'express'
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
export class HealthController extends Controller {
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
   */
  @Get('me')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  @Response<ErrorResponse>(401, 'Unauthorized')
  public async getMe(
    @Request() req: express.Request,
    @Header('Authorization') authorization?: string,
  ): Promise<UserResponse> {
    if (!authorization) {
      this.setStatus(401)
      throw new Error('Unauthorized')
    }
    
    return {
      userId: '123',
      name: 'John Doe',
    }
  }
}

