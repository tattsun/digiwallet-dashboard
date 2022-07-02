// Base Errors
export class DwApplicationError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
  }
}

export class DwExceptionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// Extended Errors
export class ValidationError extends DwApplicationError {
  constructor(message: string) {
    super(`validation error: ${message}`, 400);
  }
}

export class NotFoundError extends DwApplicationError {
  constructor() {
    super(`not found`, 404);
  }
}
