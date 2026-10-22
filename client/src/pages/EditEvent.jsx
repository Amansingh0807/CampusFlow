import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { api } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyForm = { title: '', description: '', category: '', date: '', startTime: '', endTime: '', venue: '', mode: 'offline', capacity: 30, registrationDeadline: '', eligibility: '', tags: '', customDetails: '' }
const dateValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : ''

export default function EditEvent() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/events/categories'), api.get(`/events/${id}/manage`)]).then(([categoryResponse, eventResponse]) => {
      const event = eventResponse.data.data
      setCategories(categoryResponse.data.data)
      setForm({ title: event.title || '', description: event.description || '', category: event.category?._id || event.category || '', date: dateValue(event.date), startTime: event.startTime || '', endTime: event.endTime || '', venue: event.venue || '', mode: event.mode || 'offline', capacity: event.capacity || 1, registrationDeadline: dateValue(event.registrationDeadline), eligibility: event.eligibility || '', tags: (event.tags || []).join(', '), customDetails: event.customDetails || '' })
    }).catch((requestError) => setError(requestError.response?.data?.message || 'You do not have permission to edit this event.')).finally(() => setLoading(false))
  }, [id])

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await api.put(`/events/${id}`, { ...form, capacity: Number(form.capacity), tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean) }); navigate(user?.role === 'ADMIN' ? '/admin' : '/organizer') } catch (requestError) { setError(requestError.response?.data?.message || 'Could not save your changes.') } finally { setBusy(false) } }

  return <DashboardLayout role={user?.role === 'ADMIN' ? 'ADMIN' : 'ORGANIZER'}><div className="form-page-heading"><Link to={user?.role === 'ADMIN' ? '/admin' : '/organizer'}><ArrowLeft size={15} /> Back to workspace</Link><p className="kicker">Owner-only event controls</p><h1>Edit the <em>details.</em></h1><p>Only the event creator or an administrator can save these changes.</p></div>{loading ? <div className="page-state">Loading editable event...</div> : error ? <div className="error-box">{error}</div> : <form className="event-form" onSubmit={submit}><div className="form-grid"><label><span>Event title</span><input required value={form.title} onChange={set('title')} /></label><label><span>Category</span><select required value={form.category} onChange={set('category')}>{categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label className="wide"><span>Description</span><textarea required rows="5" value={form.description} onChange={set('description')} /></label><label><span>Date</span><input required type="date" value={form.date} onChange={set('date')} /></label><label><span>Registration deadline</span><input required type="date" value={form.registrationDeadline} onChange={set('registrationDeadline')} /></label><label><span>Start time</span><input required type="time" value={form.startTime} onChange={set('startTime')} /></label><label><span>End time</span><input required type="time" value={form.endTime} onChange={set('endTime')} /></label><label><span>Format</span><select value={form.mode} onChange={set('mode')}><option value="offline">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select></label><label><span>Capacity</span><input required min={form.capacity > 0 ? form.capacity : 1} type="number" value={form.capacity} onChange={set('capacity')} /></label><label className="wide"><span>Venue or link</span><input value={form.venue} onChange={set('venue')} /></label><label className="wide"><span>Tags</span><input value={form.tags} onChange={set('tags')} /></label><label className="wide"><span>Eligibility</span><input value={form.eligibility} onChange={set('eligibility')} /></label><label className="wide"><span>Extra custom details</span><textarea rows="4" value={form.customDetails} onChange={set('customDetails')} placeholder="Additional attendee information" /></label></div>{error && <div className="form-error">{error}</div>}<button disabled={busy} className="button button-coral"><Save size={16} /> {busy ? 'Saving changes...' : 'Save changes'}</button></form>}</DashboardLayout>
}
