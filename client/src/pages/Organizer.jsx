import { ArrowRight, CalendarDays, Check, Plus, Ticket, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { api } from '../services/api.js'

export default function Organizer() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/dashboard/organizer')
      .then(({ data: response }) => setData(response.data))
      .catch(() => setError('Could not load your events.'))
  }, [])

  const publish = async (id) => {
    try {
      await api.patch(`/events/${id}/status`, { status: 'published' })
      setData((current) => ({
        ...current,
        events: current.events.map((event) => event._id === id ? { ...event, status: 'published' } : event),
        publishedEvents: current.publishedEvents + 1,
      }))
    } catch {
      setError('Could not publish this event.')
    }
  }

  return <DashboardLayout role="ORGANIZER">
    <div className="dash-heading"><div><p className="kicker">Organizer workspace</p><h1>Make something<br /><em>worth showing up for.</em></h1></div><Link className="button button-coral" to="/organizer/events/new"><Plus size={16} /> Create event</Link></div>
    {error && <div className="error-box">{error}</div>}
    {!data ? <div className="page-state">Loading your workspace...</div> : <>
      <div className="metric-grid"><div><span><CalendarDays size={16} /> Total events</span><strong>{data.totalEvents}</strong><small>across your organization</small></div><div><span><TrendingUp size={16} /> Published</span><strong>{data.publishedEvents}</strong><small>live opportunities</small></div><div><span><Ticket size={16} /> Registrations</span><strong>{data.registrations}</strong><small>students reached</small></div></div>
      <section className="table-section"><div className="section-title"><div><p className="kicker">Your program</p><h2>Recent events</h2></div><Link to="/organizer/events">Manage all <ArrowRight size={14} /></Link></div><div className="event-table"><div className="table-head"><span>Event</span><span>Status</span><span>Registrations</span><span>Date</span></div>{data.events.map((event) => <div className="table-row" key={event._id}><strong>{event.title}</strong><span className={`status ${event.status}`}>{event.status}</span><span>{event.registeredCount} / {event.capacity}</span><span>{new Date(event.date).toLocaleDateString()}</span>{event.status === 'draft' && <button className="publish-action" onClick={() => publish(event._id)}><Check size={14} /> Publish</button>}</div>)}</div></section>
    </>}
  </DashboardLayout>
}
