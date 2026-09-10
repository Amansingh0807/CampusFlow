import { ArrowRight, CalendarDays, Compass, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()
  const dashboard = user ? user.role === 'ADMIN' ? '/admin' : user.role === 'ORGANIZER' ? '/organizer' : '/dashboard' : '/register'

  return <>
    <Navbar />
    <main className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker"><Sparkles size={14} /> One platform for every campus opportunity</p>
          <h1>Find your next<br /><em>big thing.</em></h1>
          <p className="hero-text">Discover the events, people and ideas that make campus feel bigger than a timetable.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/events">Explore opportunities <ArrowRight size={17} /></Link>
            <Link className="text-link" to={dashboard}>{user ? 'Open your dashboard' : 'Create a free account'} <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="hero-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-note"><span>THIS WEEK</span><strong>Make room<br />for curious.</strong><i>✦</i></div><div className="hero-stamp">EST.<br /><b>2024</b></div></div>
      </section>
      <section className="stats-row"><div><strong>2,400+</strong><span>opportunities shared</span></div><div><strong>38</strong><span>campus communities</span></div><div><strong>91%</strong><span>students found a fit</span></div><div><strong>4.9/5</strong><span>member rating</span></div></section>
      <section className="section-intro" id="how-it-works"><p className="kicker">The campus, in motion</p><h2>Good things happen<br /><em>when you show up.</em></h2><div className="how-grid"><div><div className="step-icon coral"><Compass /></div><span>01</span><h3>Find your signal</h3><p>Filter the noise. Find workshops, teams and events that match where you're headed.</p></div><div><div className="step-icon yellow"><CalendarDays /></div><span>02</span><h3>Save your spot</h3><p>Keep your week in one place and register before the good seats disappear.</p></div><div><div className="step-icon blue"><Users /></div><span>03</span><h3>Meet your people</h3><p>Turn an interest into a room full of people who are interested too.</p></div></div></section>
      <section className="home-cta"><div><p className="kicker">Your campus is waiting</p><h2>Start somewhere<br /><em>interesting.</em></h2></div><Link className="button button-light" to="/events">Browse all events <ArrowRight size={17} /></Link></section>
    </main>
    <footer className="site-footer"><span className="logo"><Sparkles size={15} /> campus<span>flow</span></span><span>Built for the in-between moments.</span><span>© 2026 CampusFlow</span></footer>
  </>
}
