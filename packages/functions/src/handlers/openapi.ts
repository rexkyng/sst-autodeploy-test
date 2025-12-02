import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

/**
 * Lambda handler for GET /api/openapi endpoint
 * Returns the OpenAPI specification
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
  try {
    // Dynamic import of the swagger spec
    const spec = await import('../generated/swagger.json', { with: { type: 'json' } })
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(spec.default || spec),
    }
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify({ error: 'Failed to load OpenAPI specification' }),
    }
  }
}

