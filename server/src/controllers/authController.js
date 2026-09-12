import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ok, fail } from '../utils/response.js'
const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, course: user.course, year: user.year, organization: user.organization })
export async function register(request, response, next) { try { const { name, email, password, college, course, year, organization, role = 'STUDENT' } = request.body; if (role === 'ADMIN') throw fail('Admin registration is not public', 403); if (!name || !email || !password || (role === 'STUDENT' && !college) || (role === 'ORGANIZER' && !organization)) throw fail('Please complete all required fields', 422); const user = await User.create({ name, email, password, college, course, year, organization, role }); return ok(response, { user: safeUser(user), token: tokenFor(user._id) }, 'Account created', 201) } catch (error) { next(error) } }
export async function login(request, response, next) { try { const { email, password } = request.body; const user = await User.findOne({ email }).select('+password'); if (!user || !(await user.comparePassword(password))) throw fail('Invalid email or password', 401); return ok(response, { user: safeUser(user), token: tokenFor(user._id) }, 'Welcome back') } catch (error) { next(error) } }
export async function me(request, response) { return ok(response, safeUser(request.user)) }
