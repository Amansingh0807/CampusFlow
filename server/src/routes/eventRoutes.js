import { Router } from 'express'
import { allow, protect } from '../middleware/auth.js'
import { bookmark, cancelRegistration, categories, createEvent, deleteEvent, getEvent, listEvents, myBookmarks, myRegistrations, registerForEvent, removeBookmark, setStatus, updateEvent } from '../controllers/eventController.js'
const router = Router()
router.get('/', listEvents); router.get('/categories', categories); router.get('/registrations/my', protect, allow('STUDENT'), myRegistrations); router.get('/bookmarks/my', protect, allow('STUDENT'), myBookmarks); router.get('/:id', getEvent)
router.post('/', protect, allow('ORGANIZER', 'ADMIN'), createEvent); router.put('/:id', protect, allow('ORGANIZER', 'ADMIN'), updateEvent); router.delete('/:id', protect, allow('ORGANIZER', 'ADMIN'), deleteEvent); router.patch('/:id/status', protect, allow('ORGANIZER', 'ADMIN'), setStatus)
router.post('/:id/register', protect, allow('STUDENT'), registerForEvent); router.delete('/:id/register', protect, allow('STUDENT'), cancelRegistration)
router.post('/:id/bookmark', protect, allow('STUDENT'), bookmark); router.delete('/:id/bookmark', protect, allow('STUDENT'), removeBookmark)
export default router
