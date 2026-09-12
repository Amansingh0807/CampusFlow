import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import { errorHandler, notFound } from './middleware/errors.js'
const app = express()
app.use(helmet()); app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })); app.use(express.json({ limit: '1mb' })); app.use(morgan('dev')); app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.get('/api/health', (request, response) => response.json({ success: true, message: 'CampusFlow API is healthy' }))
app.use('/api/auth', authRoutes); app.use('/api/events', eventRoutes); app.use('/api/dashboard', dashboardRoutes); app.use('/api/notifications', notificationRoutes)
app.use(notFound); app.use(errorHandler)
export default app
