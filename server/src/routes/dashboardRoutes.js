import { Router } from 'express'
import { allow, protect } from '../middleware/auth.js'
import { adminDashboard, organizerDashboard, studentDashboard } from '../controllers/dashboardController.js'
const router = Router()
router.get('/student', protect, allow('STUDENT'), studentDashboard); router.get('/organizer', protect, allow('ORGANIZER'), organizerDashboard); router.get('/admin', protect, allow('ADMIN'), adminDashboard)
export default router
