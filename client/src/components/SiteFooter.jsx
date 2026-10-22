import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <Link to="/" className="logo-link"><span className="logo"><Sparkles size={15} /> campus<span>flow</span></span></Link>
        <p>One place for the things<br />worth showing up for.</p>
        <span className="footer-status"><i /> CampusFlow is live</span>
      </div>
      <div className="footer-column"><strong>Explore</strong><Link to="/events">Discover events</Link><a href="/#how-it-works">How it works</a><Link to="/events">Browse opportunities</Link></div>
      <div className="footer-column"><strong>Join in</strong><Link to="/register">Create an account</Link><Link to="/login">Log in</Link><Link to="/organizer">For organizers</Link></div>
      <div className="footer-note"><span>✦</span><p>Small steps.<br /><em>Big campus energy.</em></p><Link to="/events">Find your next thing <ArrowUpRight size={14} /></Link></div>
    </div>
    <div className="footer-bottom"><span>© 2026 CampusFlow</span><span>Built for the in-between moments.</span><span>React · Express · MongoDB</span></div>
  </footer>
}
