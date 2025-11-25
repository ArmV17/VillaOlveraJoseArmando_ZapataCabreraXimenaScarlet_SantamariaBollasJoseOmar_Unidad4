import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

export default function App(){
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const logout = () => { localStorage.removeItem('token'); nav('/login') }
  const isLogged = !!localStorage.getItem('token')
  const onLoginPage = pathname.startsWith('/login')

  return (
    <div>
      <header>
        <div className="wrap">
          <div className="brand">Mi Barrio Seguro</div>
          <div className="spacer" />
          {isLogged && <button className="btn" onClick={toggleTheme}>{theme==='dark'?'🌙 Oscuro':'🌞 Claro'}</button>}
          {!onLoginPage && <button className="btn ghost" onClick={logout}>Salir</button>}
        </div>
      </header>
      <div className="container">
        <Outlet/>
      </div>
    </div>
  )
}
