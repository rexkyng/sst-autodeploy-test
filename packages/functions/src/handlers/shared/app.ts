import express, {
  json,
  urlencoded,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from 'express'
import cors from 'cors'
import { ValidateError } from 'tsoa'
import { RegisterRoutes } from '../../generated/routes'
import { ensureDatabaseInitialized } from './database-init'

export function createApp(): express.Express {
  // Initialize database on cold start
  ensureDatabaseInitialized()

  const app = express()

  // CORS middleware
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )

  // Body parsing middleware
  app.use(urlencoded({ extended: true }))
  app.use(json())

  // Register TSOA routes
  RegisterRoutes(app)

  // Not found handler
  app.use(function notFoundHandler(_req: ExRequest, res: ExResponse) {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${_req.method} ${_req.path} not found`,
    })
  })

  // Error handler
  app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
      return res.status(422).json({
        error: 'Validation Failed',
        details: err.fields,
      })
    }

    if (err instanceof Error) {
      console.error('Error:', err.message)
      const status = (err as any).status || 500
      return res.status(status).json({
        error: status === 500 ? 'Internal Server Error' : 'Bad Request',
        message: err.message,
      })
    }

    next()
  })

  return app
}

