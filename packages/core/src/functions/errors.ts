/**
 * Custom error class for function errors with HTTP status codes
 */
export class FunctionError extends Error {
  public readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'FunctionError'
  }
}

export interface ErrorResponse {
  error: string
  message?: string
}
