export function notFound(request, response) { response.status(404).json({ success: false, message: `Route ${request.method} ${request.originalUrl} not found` }) }
export function errorHandler(error, request, response, next) {
  console.error(error)
  if (error.code === 11000) return response.status(409).json({ success: false, message: 'A record with this value already exists' })
  if (error.name === 'ValidationError') return response.status(422).json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(', ') })
  if (error.name === 'CastError') return response.status(400).json({ success: false, message: 'Invalid resource identifier' })
  const status = error.statusCode || 500
  response.status(status).json({ success: false, message: status >= 500 ? 'Internal server error' : (error.message || 'Request failed') })
}
