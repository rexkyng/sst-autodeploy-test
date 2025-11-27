import type { StatusCode } from 'hono/utils/http-status'

export class ControllerError extends Error {
  public readonly status: StatusCode

  constructor(status: StatusCode, message: string) {
    super(message)
    this.status = status
  }
}

