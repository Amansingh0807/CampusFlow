import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api.js'
const AuthContext = createContext(null)
export function AuthProvider({ children }) { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true)
  useEffect(() => { if (!localStorage.getItem('campusflow_token')) return setLoading(false); api.get('/auth/me').then(({ data }) => setUser(data.data)).catch(() => localStorage.removeItem('campusflow_token')).finally(() => setLoading(false)) }, [])
  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); localStorage.setItem('campusflow_token', data.data.token); setUser(data.data.user); return data.data.user }
  const register = async (payload) => { const { data } = await api.post('/auth/register', payload); localStorage.setItem('campusflow_token', data.data.token); setUser(data.data.user); return data.data.user }
  const logout = () => { localStorage.removeItem('campusflow_token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
