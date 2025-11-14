// Panel lateral con información del usuario autenticado.
// Muestra favoritos y reseñas propias, con acciones de cierre de sesión y borrado.
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import '../styles/PanelUsuario.css'

function PanelUsuario({ onClose }) {
  const { user, logout } = useContext(AuthContext)
  const [favoritos, setFavoritos] = useState([])
  const [misResenas, setMisResenas] = useState([])
  // Guardamos aquí los nombres de juegos por su id para mostrarlos fácil.
  const [juegosPorId, setJuegosPorId] = useState({})

  // Carga favoritos del usuario y filtra sus reseñas.
  const cargar = async () => {
    const fav = await api.get('/api/favoritos')
    setFavoritos(fav.data)
    const r = await api.get('/api/resenas')
    const mias = r.data.filter(x => x.autor === user?.nombre)
    setMisResenas(mias)
    // Traemos tus juegos y creamos un mapa id -> título.
    try {
      const j = await api.get('/api/juegos')
      const mapa = {}
      j.data.forEach(g => { mapa[g._id] = g.titulo })
      setJuegosPorId(mapa)
    } catch (e) {
      // Si no podemos traer juegos, dejamos el mapa vacío.
      setJuegosPorId({})
    }
  }

  useEffect(() => { if (user) cargar() }, [user])

  // Borra una reseña propia tras confirmación de usuario.
  const borrarResena = async (id) => {
    const ok = window.confirm('¿Deseas borrar esta reseña?')
    if (!ok) return
    await api.delete(`/api/resenas/${id}`)
    setMisResenas(prev => prev.filter(x => x._id !== id))
  }

  return (
    <div className="panel-usuario">
      <div className="panel-header">
        <span>{user?.nombre}</span>
        <div className="panel-actions">
          {user && <button className="btn-cerrar-sesion" onClick={logout}>Cerrar sesión</button>}
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
      <div className="panel-seccion">
        <h4>Favoritos</h4>
        {favoritos.length === 0 ? <p>No tienes favoritos</p> : (
          <ul>
            {favoritos.map(j => (
              <li key={j._id}>{j.titulo}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="panel-seccion">
        <h4>Mis reseñas</h4>
        {misResenas.length === 0 ? <p>No tienes reseñas</p> : (
          <ul>
            {misResenas.map(r => (
              <li key={r._id}>
                {/* Mostramos el nombre del juego al que pertenece esta reseña */}
                <strong>Juego:</strong> {juegosPorId[r.juegoId] || 'Juego no disponible'}
                <br />
                {r.texto}
                <button className="btn-cerrar-sesion" onClick={() => borrarResena(r._id)}>
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PanelUsuario