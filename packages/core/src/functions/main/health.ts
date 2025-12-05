export interface HealthResponse {
  status: string
  timestamp: string
  service: string
  version: string
}

export interface UserResponse {
  userId: string
  name: string
}

/**
 * Health check endpoint
 */
export async function getHealth(): Promise<HealthResponse> {
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
export async function getMe(): Promise<UserResponse> {
  // API Gateway validates JWT before this runs
  // In a real implementation, user info would come from the JWT claims
  return {
    userId: '123',
    name: 'John Doe',
  }
}
