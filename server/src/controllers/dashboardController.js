import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Bookmark from '../models/Bookmark.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'

export async function studentDashboard(request, response, next) {
  try {
    const [registrations, bookmarks, notifications, recommended] = await Promise.all([
      Registration.find({ user: request.user._id, status: 'registered' }).select('event status createdAt').populate({ path: 'event', select: 'title date startTime endTime venue mode capacity registeredCount category organizer', populate: [{ path: 'category', select: 'name' }, { path: 'organizer', select: 'name organization' }] }).sort({ createdAt: -1 }).limit(5).lean(),
      Bookmark.countDocuments({ user: request.user._id }),
      Notification.find({ user: request.user._id }).select('title message type read createdAt').sort({ createdAt: -1 }).limit(5).lean(),
      Event.find({ status: 'published' }).select('title description category organizer date startTime endTime venue mode capacity registeredCount').populate('category', 'name').sort({ date: 1 }).limit(4).lean(),
    ])
    response.json({ success: true, data: { registrations, bookmarkCount: bookmarks, notifications, recommended } })
  } catch (error) { next(error) }
}

export async function organizerDashboard(request, response, next) {
  try {
    const organizer = request.user._id
    const [events, [summary = { totalEvents: 0, publishedEvents: 0, registrations: 0 }]] = await Promise.all([
      Event.find({ organizer }).select('title status date capacity registeredCount category').populate('category', 'name').sort({ createdAt: -1 }).limit(20).lean(),
      Event.aggregate([{ $match: { organizer } }, { $group: { _id: null, totalEvents: { $sum: 1 }, publishedEvents: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } }, registrations: { $sum: '$registeredCount' } } }]),
    ])
    response.json({ success: true, data: { events, ...summary } })
  } catch (error) { next(error) }
}

export async function adminDashboard(request, response, next) {
  try {
    const [totalUsers, students, organizers, totalEvents, publishedEvents, registrations] = await Promise.all([
      User.countDocuments(), User.countDocuments({ role: 'STUDENT', isActive: true }), User.countDocuments({ role: 'ORGANIZER', isActive: true }),
      Event.countDocuments(), Event.countDocuments({ status: 'published' }), Registration.countDocuments({ status: 'registered' }),
    ])
    response.json({ success: true, data: { totalUsers, students, organizers, totalEvents, publishedEvents, registrations } })
  } catch (error) { next(error) }
}
