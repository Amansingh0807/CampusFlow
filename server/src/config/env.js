import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serverRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')
dotenv.config({ path: join(serverRoot, '.env') })

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('replace-with')) throw new Error('JWT_SECRET must be a non-default value')
if (process.env.JWT_SECRET.length < 32 && process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET must be at least 32 characters in production')
if (process.env.JWT_SECRET.length < 32) console.warn('JWT_SECRET is shorter than 32 characters; use a longer random secret before deployment')
