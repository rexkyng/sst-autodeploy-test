import serverless from 'serverless-http'
import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createApp } from './app'

// Cache the app instance for warm Lambda invocations
let cachedApp: ReturnType<typeof createApp> | null = null

function getApp() {
  if (!cachedApp) {
    cachedApp = createApp()
  }
  return cachedApp
}

// Create the serverless handler
const serverlessHandler = serverless(getApp())

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context
) => {
  // Set callbackWaitsForEmptyEventLoop to false for better Lambda performance
  context.callbackWaitsForEmptyEventLoop = false
  
  return serverlessHandler(event, context) as Promise<APIGatewayProxyResult>
}

