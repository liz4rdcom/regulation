class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    Error.captureStackTrace(this, this.constructor)

    this.name = 'ServiceError'
    this.message = message
    this.statusCode = statusCode
  }
}

module.exports = ServiceError
