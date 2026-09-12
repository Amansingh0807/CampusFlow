import mongoose from 'mongoose'
import Event from '../models/Event.js'
import Category from '../models/Category.js'
import Registration from '../models/Registration.js'
import Bookmark from '../models/Bookmark.js'
import Notification from '../models/Notification.js'
import { ok, fail } from '../utils/response.js'

const editableEventFields = ['title', 'description', 'category', 'date', 'startTime', 'endTime', 'venue', 'mode', 'image', 'capacity', 'registrationDeadline', 'tags', 'eligibility']
const pickEventFields = (source) => Object.fromEntries(editableEventFields.filter((field) => source[field] !== undefined).map((field) => [field, source[field]]))
const pageOptions = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 9, 1), 50)
  return { page, limit, skip: (page - 1) * limit }
}

export async function listEvents(request, response, next) {
  try {
    const { page, limit, skip } = pageOptions(request.query)
    const { search, category, mode, sort = 'date' } = request.query
    const query = { status: 'published' }
    if (search?.trim()) query.$text = { $search: search.trim() }
    if (category) query.category = category
    if (mode) query.mode = mode
    const count = await Event.countDocuments(query)
    const events = await Event.find(query)
      .select('title description category organizer date startTime endTime venue mode image capacity registeredCount registrationDeadline tags eligibility status')
      .populate('category', 'name slug')
      .populate('organizer', 'name organization')
      .sort(sort === 'newest' ? { createdAt: -1 } : { date: 1 })
      .skip(skip).limit(limit).lean()
    return response.json({ success: true, data: events, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } })
  } catch (error) { next(error) }
}

export async function getEvent(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) throw fail('Invalid event id', 400)
    const event = await Event.findOne({ _id: request.params.id, status: 'published' })
      .select('title description category organizer date startTime endTime venue mode image capacity registeredCount registrationDeadline tags eligibility status')
      .populate('category', 'name').populate('organizer', 'name organization').lean()
    if (!event) throw fail('Event not found', 404)
    return ok(response, event)
  } catch (error) { next(error) }
}

export async function createEvent(request, response, next) {
  try {
    const event = await Event.create({ ...pickEventFields(request.body), status: 'published', organizer: request.user._id })
    return ok(response, event, 'Event published', 201)
  } catch (error) { next(error) }
}

export async function updateEvent(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) throw fail('Invalid event id', 400)
    const event = await Event.findOne({ _id: request.params.id, organizer: request.user._id })
    if (!event) throw fail('Event not found or not owned by you', 404)
    Object.assign(event, pickEventFields(request.body))
    await event.save()
    return ok(response, event, 'Event updated')
  } catch (error) { next(error) }
}

export async function deleteEvent(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) throw fail('Invalid event id', 400)
    const event = await Event.findOneAndDelete({ _id: request.params.id, organizer: request.user._id })
    if (!event) throw fail('Event not found or not owned by you', 404)
    return ok(response, null, 'Event deleted')
  } catch (error) { next(error) }
}

export async function setStatus(request, response, next) {
  try {
    const allowedStatuses = ['draft', 'published', 'cancelled', 'completed']
    if (!allowedStatuses.includes(request.body.status)) throw fail('Invalid event status', 422)
    if (!mongoose.isValidObjectId(request.params.id)) throw fail('Invalid event id', 400)
    const filter = request.user.role === 'ADMIN' ? { _id: request.params.id } : { _id: request.params.id, organizer: request.user._id }
    const event = await Event.findOneAndUpdate(filter, { status: request.body.status }, { new: true, runValidators: true })
    if (!event) throw fail('Event not found or not owned by you', 404)
    return ok(response, event, 'Event status updated')
  } catch (error) { next(error) }
}

export async function registerForEvent(request, response, next) {
  const session = await mongoose.startSession()
  try {
    let registration
    await session.withTransaction(async () => {
      const event = await Event.findOneAndUpdate(
        { _id: request.params.id, status: 'published', registrationDeadline: { $gte: new Date() }, $expr: { $lt: ['$registeredCount', '$capacity'] } },
        { $inc: { registeredCount: 1 } }, { new: true, session }
      )
      if (!event) throw fail('Event is unavailable, full, or past its registration deadline', 409)
      const existing = await Registration.findOne({ user: request.user._id, event: event._id }, null, { session })
      if (existing?.status === 'registered') throw fail('You are already registered', 409)
      registration = existing
        ? await Registration.findByIdAndUpdate(existing._id, { status: 'registered' }, { new: true, session })
        : (await Registration.create([{ user: request.user._id, event: event._id }], { session }))[0]
      await Notification.create([{ user: request.user._id, title: 'Registration confirmed', message: `You are registered for ${event.title}`, type: 'registration' }], { session })
    })
    return ok(response, registration, 'Registration confirmed', 201)
  } catch (error) { next(error) } finally { await session.endSession() }
}

export async function cancelRegistration(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) throw fail('Invalid event id', 400)
    const registration = await Registration.findOneAndUpdate({ user: request.user._id, event: request.params.id, status: 'registered' }, { status: 'cancelled' }, { new: true })
    if (!registration) throw fail('Registration not found', 404)
    await Event.findOneAndUpdate({ _id: request.params.id, $expr: { $gt: ['$registeredCount', 0] } }, { $inc: { registeredCount: -1 } })
    return ok(response, null, 'Registration cancelled')
  } catch (error) { next(error) }
}

export async function bookmark(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) throw fail('Invalid event id', 400)
    const item = await Bookmark.findOneAndUpdate({ user: request.user._id, event: request.params.id }, { $setOnInsert: { user: request.user._id, event: request.params.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    return ok(response, item, 'Event bookmarked', 201)
  } catch (error) { next(error) }
}

export async function removeBookmark(request, response, next) { try { await Bookmark.findOneAndDelete({ user: request.user._id, event: request.params.id }); return ok(response, null, 'Bookmark removed') } catch (error) { next(error) } }
export async function myRegistrations(request, response, next) { try { const { limit, skip } = pageOptions(request.query); const items = await Registration.find({ user: request.user._id, status: 'registered' }).select('event status createdAt').populate({ path: 'event', select: 'title date startTime endTime venue mode capacity registeredCount category organizer', populate: [{ path: 'category', select: 'name' }, { path: 'organizer', select: 'name' }] }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(); return ok(response, items) } catch (error) { next(error) } }
export async function myBookmarks(request, response, next) { try { const { limit, skip } = pageOptions(request.query); const items = await Bookmark.find({ user: request.user._id }).select('event createdAt').populate({ path: 'event', select: 'title description date startTime venue mode capacity registeredCount category', populate: { path: 'category', select: 'name' } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(); return ok(response, items) } catch (error) { next(error) } }
export async function categories(request, response, next) { try { return ok(response, await Category.find().select('name slug icon').sort({ name: 1 }).lean()) } catch (error) { next(error) } }
