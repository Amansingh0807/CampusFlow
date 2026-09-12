import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { list, read, readAll } from '../controllers/notificationController.js'
const router = Router()
router.use(protect); router.get('/', list); router.patch('/:id/read', read); router.patch('/read-all', readAll)
export default router
