import Notification from '../models/Notification.js'
import { ok } from '../utils/response.js'
export async function list(request, response, next) { try { return ok(response, await Notification.find({ user: request.user._id }).sort({ createdAt: -1 }).limit(30)) } catch (error) { next(error) } }
export async function read(request, response, next) { try { return ok(response, await Notification.findOneAndUpdate({ _id: request.params.id, user: request.user._id }, { read: true }, { new: true })) } catch (error) { next(error) } }
export async function readAll(request, response, next) { try { await Notification.updateMany({ user: request.user._id }, { read: true }); return ok(response, null, 'Notifications marked as read') } catch (error) { next(error) } }
