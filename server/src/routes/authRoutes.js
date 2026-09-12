import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import rateLimit from 'express-rate-limit'
const router = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false })
router.post('/register', authLimiter, register); router.post('/login', authLimiter, login); router.get('/me', protect, me)
export default router
