import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import api from '../api/client.js'

export default function MapView({lat, lon, mini}){
  const mapRef = useRef(null)
  const [weather, setWeather] = useState(null)

  useEffect(()=>{
    const map = L.map(mapRef.current, { zoomControl: !mini }).setView([lat, lon], mini? 14 : 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
    const marker = L.marker([lat, lon]).addTo(map)
    ;(async()=>{
      try{
        const r = await api.get(`/utils/weather?lat=${lat}&lon=${lon}`)
        setWeather(r.data?.current_weather)
        marker.bindPopup(`Clima: ${r.data?.current_weather?.temperature ?? '?'}°C`)
      }catch{}
    })()
    return ()=> map.remove()
  }, [lat, lon, mini])

  return (
    <div>
      <div id="map" ref={mapRef} style={{height: mini? 260 : 440, borderRadius:14, overflow:'hidden'}} />
      {weather && <div>Temp: {weather.temperature}°C — Viento: {weather.windspeed} km/h</div>}
    </div>
  )
}
