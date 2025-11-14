// Este archivo crea una "instancia" de Axios para hablar con nuestra API.
// Así centralizamos la configuración (URL base, cabeceras, token, etc.).
import axios from 'axios'

// Usamos una variable de entorno si existe; si no, localhost por defecto.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({ baseURL, withCredentials: true, headers: { 'Content-Type': 'application/json' } })

// Antes de cada petición, si tenemos un token guardado, lo agregamos a las cabeceras.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api