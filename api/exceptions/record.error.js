class RecordError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    Error.captureStackTrace(this, this.constructor)

    this.name = 'RecordError'
    this.message = message
    this.statusCode = statusCode
  }
}

module.exports = RecordError
