// An error with an HTTP status, so routes can send the user a clear reason.
export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
