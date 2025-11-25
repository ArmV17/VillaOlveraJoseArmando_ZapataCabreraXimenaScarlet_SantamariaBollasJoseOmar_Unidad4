import React, { useEffect, useState, useCallback } from 'react'
import api, { setAuth } from '../api/client.js'
import MapView from '../components/MapView.jsx'

export default function Dashboard(){
  const [reports, setReports] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', category:'bache', lat:25.547, lon:-100.946 })
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const r = await api.get('/reports')
    setReports(r.data)
  }, [])

  useEffect(() => { setAuth(); load() }, [load])

  useEffect(() => {
    const onKey = (e) => { if(e.key === 'Escape') setShowModal(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openModal = () => setShowModal(true)
  const closeModal = () => { setMsg(''); setShowModal(false) }

  const createReport = async (e) => {
    e.preventDefault()
    try {
      await api.post('/reports', form)
      setMsg('✅ Reporte creado')
      setForm({ ...form, title:'', description:'' })
      load()
      setTimeout(()=>{ setMsg(''); closeModal() }, 800)
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error')
    }
  }

  return (
    <div className="grid">
      <section>
        <div className="card" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
          <div>
            <h2 style={{margin:0}}>Reportes</h2>
            <p className="subtle" style={{marginTop:6}}>Crea y visualiza incidencias de tu zona.</p>
          </div>
          <button className="btn" onClick={openModal}>Crear reporte</button>
        </div>

        <div className="card" style={{marginTop:16}}>
          {reports.length === 0 && <p className="subtle">Aún no hay reportes. Crea el primero ↑</p>}
          {reports.map(r => (
            <div key={r.id} className="item">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span className="tag">{r.category}</span>
                <strong style={{fontSize:'1.02rem'}}>{r.title}</strong>
                <span className="subtle" style={{marginLeft:'auto'}}>Estado: <b>{r.status}</b></span>
              </div>
              <div className="subtle">{r.description}</div>
              <MapView lat={r.lat} lon={r.lon} mini/>
            </div>
          ))}
        </div>
      </section>

      <aside>
        <div className="card">
          <h2>Mapa general</h2>
          <MapView lat={form.lat} lon={form.lon}/>
          <small className="muted">Arriba: ejemplo con clima en el marcador.</small>
        </div>
      </aside>

      {showModal && (
        // 🚨 CAMBIO APLICADO AQUÍ
        <div className="modal-backdrop" 
          onClick={(e)=>{ if(e.target === e.currentTarget) closeModal() }}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            // El z-index alto asegura que esté por encima del mapa
            zIndex: 9999 
          }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <header>
              <div className="wrap" style={{maxWidth:'100%', padding:0}}>
                <h3 id="modal-title" style={{margin:0}}>Crear reporte</h3>
                <div className="spacer" />
                <button className="btn x" onClick={closeModal} title="Cerrar">Cerrar</button>
              </div>
            </header>
            <div className="body">
              <p className="subtle">Describe el incidente, selecciona categoría y ubicación.</p>
              <form onSubmit={createReport} style={{marginTop:10, display:'flex', flexDirection:'column', gap:12}}>
                <div className="row">
                  <div className="field">
                    <label>Título</label>
                    <input placeholder="Bache grande frente a la primaria"
                      value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>Descripción</label>
                    <input placeholder="Se acumula agua y daña llantas"
                      value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <label>Categoría</label>
                    <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                      <option value='bache'>Bache</option>
                      <option value='luminaria'>Luminaria</option>
                      <option value='basura'>Basura</option>
                      <option value='seguridad'>Seguridad</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Latitud</label>
                    <input value={form.lat} onChange={e=>setForm({...form, lat:parseFloat(e.target.value||0)})}/>
                  </div>
                  <div className="field">
                    <label>Longitud</label>
                    <input value={form.lon} onChange={e=>setForm({...form, lon:parseFloat(e.target.value||0)})}/>
                  </div>
                </div>

                <div className="actions">
                  <button className="btn" type="submit">Guardar</button>
                  <button className="btn secondary" type="button" onClick={closeModal}>Cancelar</button>
                  {msg && <span className={msg.startsWith('✅') ? 'help' : 'error'}>{msg}</span>}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}