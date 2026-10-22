import { Bookmark, CalendarDays, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

function getPhase(date) {
  const eventDate = new Date(date)
  const today = new Date()
  eventDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  if (eventDate.getTime() === today.getTime()) return { label: 'Present today', className: 'present' }
  if (eventDate > today) return { label: 'Upcoming', className: 'upcoming' }
  return { label: 'Past event', className: 'past' }
}

export default function EventCard({ event, onBookmark }) {
  const phase = getPhase(event.date)
  return <article className="event-card"><div className={`event-image ${event.category?.slug || 'default'}`}><span>{event.category?.name || 'Opportunity'}</span><button onClick={() => onBookmark?.(event._id)} aria-label="Bookmark event"><Bookmark size={17} /></button></div><div className="event-card-body"><div className="event-card-top"><span className="mono">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><span className={`phase-badge ${phase.className}`}>{phase.label}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="event-meta"><span><CalendarDays size={14} /> {event.startTime}</span><span><MapPin size={14} /> {event.mode === 'online' ? 'Online' : event.venue || 'Campus'}</span><span><Users size={13} /> {event.capacity - event.registeredCount} seats</span></div><Link className="card-link" to={`/events/${event._id}`}>Explore event <span>↗</span></Link></div></article>
}
