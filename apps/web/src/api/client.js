import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:4000/api' })
export function setAuth(){
  const t = localStorage.getItem('token')
  if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  else delete api.defaults.headers.common['Authorization']
}
export default api
