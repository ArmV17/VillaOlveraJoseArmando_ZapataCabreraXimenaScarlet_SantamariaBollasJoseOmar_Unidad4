import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './pages/App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}>
        <Route index element={<Navigate to='/login'/>} />
        <Route path='login' element={<Login/>} />
        <Route path='dashboard' element={<Dashboard/>} />
      </Route>
    </Routes>
  </BrowserRouter>
)
