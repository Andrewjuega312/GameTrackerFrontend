// Tarjeta simple para la Biblioteca General
// Muestra solo portada, título y plataforma para evitar información repetida.
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/TarjetaJuego.css';

function TarjetaJuegoSimple({ juego, onDeleted }) {
  const { user } = useContext(AuthContext)
  const { _id, titulo, plataforma, portada } = juego;

  return (
    <div className="tarjeta-juego">
      <img src={portada} alt={titulo} className="portada" />
      <h3>{titulo}</h3>
      <div style={{ marginTop: 8, fontSize: '0.95rem', color: 'var(--color-texto)' }}>
        Plataforma: {plataforma || 'N/A'}
      </div>
      <div className="acciones" style={{ marginTop: 12 }}>
        {user && (
          <button
            className="btn-borrar"
            onClick={async () => {
              const ok = window.confirm('¿Deseas borrar este juego de la biblioteca principal?')
              if (!ok) return
              try {
                const api = (await import('../api/axios')).default
                await api.delete(`/api/catalogo-juegos/${_id}`)
                if (onDeleted) onDeleted(_id)
              } catch (e) {}
            }}
          >
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}

export default TarjetaJuegoSimple;