// Página para gestionar reseñas del usuario.
// Permite agregar reseñas a juegos, editar y borrar las propias, y ver todas.
import React, { useEffect, useMemo, useState, useContext } from 'react'
import api from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import '../styles/FormularioResena.css'
import '../styles/ListaResenas.css'

function Resenas() {
  const { user, logout } = useContext(AuthContext)
  const [resenas, setResenas] = useState([])
  const [juegos, setJuegos] = useState([])
  const [todosJuegos, setTodosJuegos] = useState([])
  const [catalogo, setCatalogo] = useState([])
  const [mapaTitulos, setMapaTitulos] = useState({})
  const [juegoId, setJuegoId] = useState('')
  const [catalogoId, setCatalogoId] = useState('')
  const [filtroTodasId, setFiltroTodasId] = useState('')
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
    const [j, jt, c] = await Promise.all([
      api.get('/api/juegos'),
      api.get('/api/juegos/todos'),
      api.get('/api/catalogo-juegos')
    ])
    setJuegos(j.data)
    setTodosJuegos(jt.data)
    setCatalogo(c.data)
    const m = {}
    jt.data.forEach(x => { m[x._id] = x.titulo })
    setMapaTitulos(m)
  }

  useEffect(() => { cargar() }, [])

  // Envía una nueva reseña del usuario sobre el juego seleccionado.
  const enviar = async e => {
    e.preventDefault()
    if (!user) return setError('Debes iniciar sesión para agregar reseñas')
    if (!juegoId && !catalogoId) return setError('Selecciona un juego')
    try {
      let juegoDestinoId = juegoId
      if (!juegoDestinoId && catalogoId) {
        const item = catalogo.find(x => x._id === catalogoId)
        if (!item) throw new Error('Juego no encontrado en catálogo')
        const ya = juegos.find(x => x.titulo.trim().toLowerCase() === item.titulo.trim().toLowerCase() && (x.plataforma||'').trim().toLowerCase() === (item.plataforma||'').trim().toLowerCase())
        if (ya) juegoDestinoId = ya._id
        else {
          const creado = await api.post('/api/juegos', { titulo: item.titulo, plataforma: item.plataforma, genero: item.genero, portada: item.portada })
          juegoDestinoId = creado.data._id
        }
      }
      await api.post('/api/resenas', { juegoId: juegoDestinoId, autor: user.nombre, texto, estrellas })
      setTexto('')
      setEstrellas(5)
      setJuegoId('')
      setCatalogoId('')
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
            <label htmlFor="catalogo">O elegir del catálogo</label>
            <select id="catalogo" value={catalogoId} onChange={e => setCatalogoId(e.target.value)}>
              <option value="">Selecciona del catálogo</option>
              {catalogo.map(j => <option key={j._id} value={j._id}>{j.titulo} · {j.plataforma}</option>)}
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
          <div className="juego-resenas-nombre">{mapaTitulos[juegoId] || (juegos.find(j=>j._id===juegoId)?.titulo || '')}</div>
          <div className="resenas-container">
            {resenas.filter(r => r.juegoId === juegoId).map(r => (
              <div key={r._id} className="resena-item">
                <div className="resena-header">
                  <span className="autor">{r.autor}</span>
                  <span className="juego-nombre">{mapaTitulos[r.juegoId] || ''}</span>
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
        <div className="filtros" style={{ marginBottom: '0.75rem' }}>
          <label style={{ marginRight: '0.5rem' }}>Filtrar por juego</label>
          <select
            value={filtroTodasId}
            onChange={e => setFiltroTodasId(e.target.value)}
          >
            <option value="">Todos</option>
            {useMemo(() => {
              const ids = new Set(resenas.map(r => r.juegoId))
              const lista = todosJuegos.filter(j => ids.has(j._id))
              return lista.map(j => <option key={j._id} value={j._id}>{j.titulo}</option>)
            }, [resenas, todosJuegos])}
          </select>
        </div>
        <div className="resenas-container">
          {(filtroTodasId ? resenas.filter(r => r.juegoId === filtroTodasId) : resenas).map(r => (
            <div key={r._id} className="resena-item">
              <div className="resena-header">
                <span className="autor">{r.autor}</span>
                <span className="juego-nombre">{mapaTitulos[r.juegoId] || ''}</span>
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