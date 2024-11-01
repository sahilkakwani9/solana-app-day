'use client'

import { useState } from 'react'
import Auth from '@/components/Auth'
import Dashboard from '@/components/Dashboard'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthenticate = () => setIsAuthenticated(true)
  const handleLogout = () => setIsAuthenticated(false)

  return isAuthenticated ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Auth onAuthenticate={handleAuthenticate} />
  )
}
