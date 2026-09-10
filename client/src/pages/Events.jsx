import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import EventCard from '../components/EventCard.jsx'
import { api } from '../services/api.js'

export default function Events() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [mode, setMode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestController = useRef(null)

  const load = (nextSearch = search, nextCategory = category, nextMode = mode) => {
    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setLoading(true)
    setError('')
    api.get('/events', { params: { search: nextSearch, category: nextCategory, mode: nextMode }, signal: controller.signal })
      .then(({ data }) => setEvents(data.data))
      .catch((requestError) => { if (requestError.code !== 'ERR_CANCELED') setError(requestError.response?.data?.message || 'Unable to load events') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
  }

  useEffect(() => {
    api.get('/events/categories').then(({ data }) => setCategories(data.data)).catch(() => {})
    load()
    return () => requestController.current?.abort()
  }, [])

  const selectCategory = (value) => { setCategory(value); load(search, value, mode) }
  const selectMode = (value) => { setMode(value); load(search, category, value) }

  return <><Navbar /><main className="events-page"><div className="page-hero"><div><p className="kicker">Discover your next chapter</p><h1>What are you<br /><em>curious about?</em></h1></div><p>Events, workshops and opportunities from the people making campus worth showing up for.</p></div><div className="filter-bar"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} placeholder="Search events, topics, people..." /></div><select value={category} onChange={(event) => selectCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select><select value={mode} onChange={(event) => selectMode(event.target.value)}><option value="">Any format</option><option value="offline">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select><button className="filter-button" onClick={() => load()}><SlidersHorizontal size={16} /> Filter</button></div>{error && <div className="error-box">{error}</div>}<div className="events-toolbar"><span>{loading ? 'Finding opportunities...' : `${events.length} opportunities found`}</span><span><Filter size={14} /> Sorted by date</span></div>{loading ? <div className="card-grid">{[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}</div> : events.length ? <div className="card-grid">{events.map((event) => <EventCard event={event} key={event._id} />)}</div> : <div className="empty-state"><span>✦</span><h3>No events found</h3><p>Try a different search and see what else is happening.</p></div>}</main></>
}
