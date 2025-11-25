import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client.js'

export default function Login(){
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'register') {
        await api.post('/auth/register', { email, password, name })
        setMsg('✅ Registro exitoso. Inicia sesión.')
        setMode('login')
        return
      }
      const r = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', r.data.token)
      nav('/dashboard')
    } catch (e) {
      setMsg(e?.response?.data?.error || 'Ocurrió un error')
    }
  }

  return (
    <div className="center">
      <div className="stack">
        <div className="tabs">
          <div className={`tab ${mode==='login'?'active':''}`} onClick={()=>setMode('login')}>Iniciar sesión</div>
          <div className={`tab ${mode==='register'?'active':''}`} onClick={()=>setMode('register')}>Registrarse</div>
        </div>

        <div className="card">
          <h2 style={{marginTop:0}}>{mode==='login' ? 'Bienvenido de vuelta 👋' : 'Crea tu cuenta ✨'}</h2>
          <p className="subtle" style={{marginTop:-6}}>
            {mode==='login' ? 'Accede para crear y seguir reportes.' : 'Un minuto y listo para reportar incidencias.'}
          </p>

          <form onSubmit={submit} style={{marginTop:12, display:'flex', flexDirection:'column', gap:12}}>
            {mode==='register' && (
              <div className="field">
                <label>Nombre</label>
                <input placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label>Correo</label>
              <input placeholder="tucorreo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>

            {msg && <div className={msg.startsWith('✅') ? 'help' : 'error'}>{msg}</div>}

            <div className="actions">
              <button className="btn" type="submit">{mode==='login' ? 'Entrar' : 'Crear cuenta'}</button>
              {mode==='login'
                ? <small className="muted">¿No tienes cuenta? <a onClick={()=>setMode('register')} href="#">Regístrate</a></small>
                : <small className="muted">¿Ya tienes cuenta? <a onClick={()=>setMode('login')} href="#">Inicia sesión</a></small>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
