import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) return res.status(400).json({ error: 'lat y lon requeridos' })
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    const r = await fetch(url)
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Error al consultar clima' })
  }
})

router.get('/geocode', async (req, res) => {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'q requerido' })
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
    const r = await fetch(url, { headers: { 'User-Agent': 'MBS-U3/1.0 (educativo)' } })
    const data = await r.json()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Error al geocodificar' })
  }
})

export default router
