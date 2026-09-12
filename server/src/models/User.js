import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['STUDENT', 'ORGANIZER', 'ADMIN'], default: 'STUDENT' },
  college: String, course: String, year: Number, organization: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })
userSchema.index({ role: 1, isActive: 1 })
userSchema.pre('save', async function save() { if (!this.isModified('password')) return; this.password = await bcrypt.hash(this.password, 12) })
userSchema.methods.comparePassword = function comparePassword(value) { return bcrypt.compare(value, this.password) }
export default mongoose.model('User', userSchema)
