// Lista y gestión de reseñas para un juego específico.
// Permite al autor borrar o editar su propia reseña.
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import '../styles/ListaResenas.css';
import { AuthContext } from '../context/AuthContext';

// Recibimos el id del juego y opcionalmente su título para mostrarlo claro.
function ListaResenas({ juegoId, juegoTitulo }) {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useContext(AuthContext)
  const [editandoId, setEditandoId] = useState('')
  const [textoEditado, setTextoEditado] = useState('')
  const [estrellasEditadas, setEstrellasEditadas] = useState(5)

  // Al montar o cambiar juegoId, traemos las reseñas del backend.
  useEffect(() => {
    const obtenerResenas = async () => {
      try {
        const respuesta = await api.get(`/api/resenas/juego/${juegoId}`);
        setResenas(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
        setCargando(false);
      }
    };

    if (juegoId) {
      obtenerResenas();
    }
  }, [juegoId]);

  // Renderiza estrellas visuales basado en la puntuación (1-5).
  const renderEstrellas = (puntuacion) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span key={i} className={i <= puntuacion ? 'estrella-llena' : 'estrella-vacia'}>
          ★
        </span>
      );
    }
    return estrellas;
  };

  if (cargando) return <div className="cargando">Cargando reseñas...</div>;

  return (
    <div className="lista-resenas">
      <h3>Reseñas</h3>
      {resenas.length === 0 ? (
        <p className="sin-resenas">No hay reseñas para este juego.</p>
      ) : (
        <div className="resenas-container">
          {resenas.map(resena => (
            <div key={resena._id} className="resena-item">
              <div className="resena-header">
                <span className="autor">{resena.autor}</span>
                <span className="fecha">{new Date(resena.fecha).toLocaleDateString()}</span>
                {/* Mostramos el nombre del juego para que se entienda a qué reseña pertenece */}
                {juegoTitulo && <span className="juego-nombre">Juego: {juegoTitulo}</span>}
                {user?.nombre === resena.autor && (
                  <button
                    className="btn-borrar-resena"
                    onClick={async () => {
                      // Confirmación antes de eliminar para evitar borrados accidentales.
                      const ok = window.confirm('¿Deseas borrar esta reseña?')
                      if (!ok) return
                      await api.delete(`/api/resenas/${resena._id}`)
                      setResenas(prev => prev.filter(x => x._id !== resena._id))
                    }}
                  >
                    Borrar
                  </button>
                )}
                {user?.nombre === resena.autor && (
                  <button
                    className="btn-borrar-resena"
                    onClick={() => {
                      setEditandoId(resena._id)
                      setTextoEditado(resena.texto)
                      setEstrellasEditadas(resena.estrellas)
                    }}
                  >
                    Editar
                  </button>
                )}
              </div>
              {editandoId === resena._id ? (
                <div className="formulario-resena">
                  <div className="campo">
                    <label>Puntuación</label>
                    <div className="selector-estrellas">
                      {[1,2,3,4,5].map(v => (
                        <label key={v} className="estrella-label">
                          <input type="radio" name={`estrellas-${resena._id}`} value={v} checked={Number(estrellasEditadas)===v} onChange={e=>setEstrellasEditadas(Number(e.target.value))} />
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
                        const r = await api.put(`/api/resenas/${resena._id}`, { texto: textoEditado, estrellas: estrellasEditadas })
                        setResenas(prev => prev.map(x => x._id === resena._id ? r.data : x))
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
                  <div className="estrellas">{renderEstrellas(resena.estrellas)}</div>
                  <p className="texto-resena">{resena.texto}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaResenas;