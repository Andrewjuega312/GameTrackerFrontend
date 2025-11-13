// Página para gestionar reseñas del usuario.
// Permite agregar reseñas a juegos, editar y borrar las propias, y ver todas.
import React, { useEffect, useState, useContext } from 'react'
import api from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import '../styles/FormularioResena.css'
import '../styles/ListaResenas.css'

function Resenas() {
  const { user, logout } = useContext(AuthContext)
  const [resenas, setResenas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [juegoId, setJuegoId] = useState('')
  const [texto, setTexto] = useState('')
  const [estrellas, setEstrellas] = useState(5)
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState('')
  const [textoEditado, setTextoEditado] = useState('')
  const [estrellasEditadas, setEstrellasEditadas] = useState(5)

  // Carga listas de reseñas y juegos para el selector.
  const cargar = async () => {
    const r = await api.get('/api/resenas')
    setResenas(r.data)
    const j = await api.get('/api/juegos')
    setJuegos(j.data)
  }

  useEffect(() => { cargar() }, [])

  // Envía una nueva reseña del usuario sobre el juego seleccionado.
  const enviar = async e => {
    e.preventDefault()
    if (!user) return setError('Debes iniciar sesión para agregar reseñas')
    if (!juegoId) return setError('Selecciona un juego')
    try {
      await api.post('/api/resenas', { juegoId, autor: user.nombre, texto, estrellas })
      setTexto('')
      setEstrellas(5)
      setJuegoId('')
      setError('')
      await cargar()
    } catch (e) {
      setError('No se pudo enviar la reseña')
    }
  }

  return (
    <div className="contenido">
      <h2>Reseñas</h2>
      {user && (
        <div className="panel-resenas">
          <span>{user.nombre}</span>
          <button className="btn-cerrar-sesion" onClick={logout}>Cerrar sesión</button>
        </div>
      )}
      <div className="formulario-resena-container">
        <h3>Agregar reseña</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={enviar} className="formulario-resena">
          <div className="campo">
            <label htmlFor="juego">Juego</label>
            <select id="juego" value={juegoId} onChange={e => setJuegoId(e.target.value)}>
              <option value="">Selecciona un juego</option>
              {juegos.map(j => <option key={j._id} value={j._id}>{j.titulo}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="estrellas">Puntuación</label>
            <div className="selector-estrellas">
              {[1,2,3,4,5].map(v => (
                <label key={v} className="estrella-label">
                  <input type="radio" name="estrellas" value={v} checked={Number(estrellas)===v} onChange={e=>setEstrellas(Number(e.target.value))} />
                  <span className={v <= Number(estrellas) ? 'estrella-llena' : 'estrella-vacia'}>★</span>
                </label>
              ))}
            </div>
          </div>
          <div className="campo">
            <label htmlFor="texto">Tu opinión</label>
            <textarea id="texto" rows="4" value={texto} onChange={e=>setTexto(e.target.value)}></textarea>
          </div>
          <button type="submit" className="btn-enviar">Enviar Reseña</button>
        </form>
      </div>
      {juegoId && (
        <div className="lista-resenas">
          <h3>Reseñas del juego seleccionado</h3>
          <div className="resenas-container">
            {resenas.filter(r => r.juegoId === juegoId).map(r => (
              <div key={r._id} className="resena-item">
                <div className="resena-header">
                  <span className="autor">{r.autor}</span>
                  <span className="fecha">{new Date(r.fecha).toLocaleDateString()}</span>
                  {user?.nombre === r.autor && (
                    <button
                      className="btn-borrar-resena"
                      onClick={async () => {
                        const ok = window.confirm('¿Deseas borrar esta reseña?')
                        if (!ok) return
                        await api.delete(`/api/resenas/${r._id}`)
                        await cargar()
                      }}
                    >
                      Borrar
                    </button>
                  )}
                </div>
                {editandoId === r._id ? (
                  <div className="formulario-resena">
                    <div className="campo">
                      <label>Puntuación</label>
                      <div className="selector-estrellas">
                        {[1,2,3,4,5].map(v => (
                          <label key={v} className="estrella-label">
                            <input type="radio" name={`edit-estrellas-${r._id}`} value={v} checked={Number(estrellasEditadas)===v} onChange={e=>setEstrellasEditadas(Number(e.target.value))} />
                            <span className={v <= Number(estrellasEditadas) ? 'estrella-llena' : 'estrella-vacia'}>★</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="campo">
                      <label>Tu opinión</label>
                      <textarea rows="4" value={textoEditado} onChange={e=>setTextoEditado(e.target.value)}></textarea>
                    </div>
                    <div className="acciones-resena">
                      <button
                        className="btn-enviar"
                        onClick={async () => {
                          const rta = await api.put(`/api/resenas/${r._id}`, { texto: textoEditado, estrellas: estrellasEditadas })
                          setResenas(prev => prev.map(x => x._id === r._id ? rta.data : x))
                          setEditandoId('')
                        }}
                      >
                        Guardar cambios
                      </button>
                      <button
                        className="btn-borrar-resena"
                        onClick={() => setEditandoId('')}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="estrellas">{'★'.repeat(r.estrellas)}</div>
                    <p className="texto-resena">{r.texto}</p>
                    {user?.nombre === r.autor && (
                      <button
                        className="btn-borrar-resena"
                        onClick={() => {
                          setEditandoId(r._id)
                          setTextoEditado(r.texto)
                          setEstrellasEditadas(r.estrellas)
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="lista-resenas">
        <h3>Todas las reseñas</h3>
        <div className="resenas-container">
          {resenas.map(r => (
            <div key={r._id} className="resena-item">
              <div className="resena-header">
                <span className="autor">{r.autor}</span>
                <span className="fecha">{new Date(r.fecha).toLocaleDateString()}</span>
                {user?.nombre === r.autor && (
                  <button
                    className="btn-borrar-resena"
                    onClick={async () => {
                      const ok = window.confirm('¿Deseas borrar esta reseña?')
                      if (!ok) return
                      await api.delete(`/api/resenas/${r._id}`)
                      await cargar()
                    }}
                  >
                    Borrar
                  </button>
                )}
              </div>
              {editandoId === r._id ? (
                <div className="formulario-resena">
                  <div className="campo">
                    <label>Puntuación</label>
                    <div className="selector-estrellas">
                      {[1,2,3,4,5].map(v => (
                        <label key={v} className="estrella-label">
                          <input type="radio" name={`edit-estrellas-todas-${r._id}`} value={v} checked={Number(estrellasEditadas)===v} onChange={e=>setEstrellasEditadas(Number(e.target.value))} />
                          <span className={v <= Number(estrellasEditadas) ? 'estrella-llena' : 'estrella-vacia'}>★</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="campo">
                    <label>Tu opinión</label>
                    <textarea rows="4" value={textoEditado} onChange={e=>setTextoEditado(e.target.value)}></textarea>
                  </div>
                  <div className="acciones-resena">
                    <button
                      className="btn-enviar"
                      onClick={async () => {
                        const rta = await api.put(`/api/resenas/${r._id}`, { texto: textoEditado, estrellas: estrellasEditadas })
                        setResenas(prev => prev.map(x => x._id === r._id ? rta.data : x))
                        setEditandoId('')
                      }}
                    >
                      Guardar cambios
                    </button>
                    <button
                      className="btn-borrar-resena"
                      onClick={() => setEditandoId('')}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="estrellas">{'★'.repeat(r.estrellas)}</div>
                  <p className="texto-resena">{r.texto}</p>
                  {user?.nombre === r.autor && (
                    <button
                      className="btn-borrar-resena"
                      onClick={() => {
                        setEditandoId(r._id)
                        setTextoEditado(r.texto)
                        setEstrellasEditadas(r.estrellas)
                      }}
                    >
                      Editar
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Resenas