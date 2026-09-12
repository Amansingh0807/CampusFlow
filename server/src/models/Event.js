import mongoose from 'mongoose'
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 }, description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true }, venue: String,
  mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'offline' }, image: String, capacity: { type: Number, required: true, min: 1 },
  registeredCount: { type: Number, default: 0, min: 0 }, registrationDeadline: { type: Date, required: true }, tags: [String], eligibility: String,
  status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'draft' }
}, { timestamps: true })
eventSchema.index({ status: 1, date: 1, category: 1, mode: 1 }); eventSchema.index({ title: 'text', description: 'text', tags: 'text' })
export default mongoose.model('Event', eventSchema)
