import mongoose from 'mongoose'
const registrationSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' } }, { timestamps: true })
registrationSchema.index({ user: 1, event: 1 }, { unique: true })
registrationSchema.index({ user: 1, status: 1, createdAt: -1 })
export default mongoose.model('Registration', registrationSchema)
