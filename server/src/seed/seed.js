import '../config/env.js'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/db.js'
import Category from '../models/Category.js'

async function seed() {
  await connectDatabase()
  const names = ['Hackathon', 'Workshop', 'Seminar', 'Competition', 'Cultural', 'Sports', 'Placement', 'Conference']
  for (const name of names) await Category.updateOne({ slug: name.toLowerCase() }, { $setOnInsert: { name, slug: name.toLowerCase() } }, { upsert: true })
  console.log('Seed complete: categories upserted; no demo users or destructive resets were performed.')
  await mongoose.disconnect()
}

seed().catch((error) => { console.error(error); process.exit(1) })
