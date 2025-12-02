import * as express from 'express'

/**
 * Mock authentication function for TSOA
 * This function is referenced by tsoa.json for OpenAPI spec generation
 * It documents the JWT authentication scheme but does not perform actual authentication
 * (actual auth is handled by API Gateway's Lambda authorizer)
 */
export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  // This is a mock implementation for OpenAPI documentation purposes
  // Actual authentication is handled by API Gateway's Lambda authorizer
  // The function always resolves successfully since API Gateway handles auth before this runs
  
  if (securityName === 'jwt') {
    const token = request.headers['authorization']
    
    // In production, API Gateway validates the token before the request reaches here
    // This mock just passes through for local development/testing
    return Promise.resolve({
      // Mock user object - API Gateway injects actual user info
      userId: 'mock-user-id',
      scopes: scopes || [],
    })
  }
  
  return Promise.reject(new Error('Unknown security scheme'))
}

