import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const EventDetails = lazy(() => import('./pages/EventDetails.jsx'))
const Auth = lazy(() => import('./pages/Auth.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Organizer = lazy(() => import('./pages/Organizer.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const CreateEvent = lazy(() => import('./pages/CreateEvent.jsx'))

function LoadingScreen() { return <div className="page-state">Loading CampusFlow...</div> }

export default function App() {
  return <BrowserRouter><AuthProvider><Suspense fallback={<LoadingScreen />}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:id" element={<EventDetails />} />
    <Route path="/login" element={<Auth />} />
    <Route path="/register" element={<Auth register />} />
    <Route element={<ProtectedRoute roles={['STUDENT']} />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/dashboard/*" element={<Dashboard />} /></Route>
    <Route element={<ProtectedRoute roles={['ORGANIZER']} />}><Route path="/organizer" element={<Organizer />} /><Route path="/organizer/events/new" element={<CreateEvent />} /><Route path="/organizer/*" element={<Organizer />} /></Route>
    <Route element={<ProtectedRoute roles={['ADMIN']} />}><Route path="/admin" element={<Admin />} /></Route>
  </Routes></Suspense></AuthProvider></BrowserRouter>
}
