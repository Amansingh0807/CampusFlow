import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(request, response, next) {
  try {
    const token = request.headers.authorization?.startsWith('Bearer ') && request.headers.authorization.split(' ')[1]
    if (!token) return response.status(401).json({ success: false, message: 'Authentication required' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    request.user = await User.findById(decoded.id).select('-password')
    if (!request.user || !request.user.isActive) return response.status(401).json({ success: false, message: 'Account is inactive or unavailable' })
    next()
  } catch { response.status(401).json({ success: false, message: 'Invalid or expired token' }) }
}
export const allow = (...roles) => (request, response, next) => roles.includes(request.user.role) ? next() : response.status(403).json({ success: false, message: 'You do not have permission for this action' })
