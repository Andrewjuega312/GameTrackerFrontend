// Tarjeta individual para cada juego en la cuadrícula.
// Muestra portada, título, estrellas y botones de acción.
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TarjetaJuego.css';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

function TarjetaJuego({ juego, onDeleted }) {
  const { user } = useContext(AuthContext)
  const [fav, setFav] = useState(false)
  // Si el juego es del usuario, puede editar y borrar.
  const propio = user?.
    _id && juego?.usuario ? String(user._id) === String(juego.usuario) : false

  // Marca o desmarca este juego como favorito del usuario.
  const toggleFav = async () => {
    try {
      const r = await api.post(`/api/favoritos/${juego._id}`)
      const ids = r.data.map(j => j._id)
      setFav(ids.includes(juego._id))
    } catch (e) {}
  }
  const { _id, titulo, portada, puntuacion, completado, horasJugadas } = juego;

  // Dibuja estrellas según la puntuación del juego (de 0 a 5).
  const renderEstrellas = (puntuacion) => {
    const estrellas = [];
    const redondeo = Math.round(Number(puntuacion));
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span key={i} className={i <= redondeo ? 'estrella-llena' : 'estrella-vacia'}>
          ★
        </span>
      );
    }
    return estrellas;
  };

  return (
    <div className="tarjeta-juego">
      <img src={portada} alt={titulo} className="portada" />
      <h3>{titulo}</h3>
  <div className="puntuacion">{renderEstrellas(puntuacion)} <span className="puntuacion-num">{Number(puntuacion).toFixed(1)}</span></div>
      <div className="estado">
        <span className={completado ? 'completado' : 'pendiente'}>
          {completado ? 'Completado' : 'Pendiente'}
        </span>
      </div>
      <div className="horas">Horas jugadas: {horasJugadas}</div>
      <div className="acciones">
        <Link to={`/juego/${_id}`} className="btn-ver">Ver detalles</Link>
        {propio && <Link to={`/editar/${_id}`} className="btn-editar">Editar</Link>}
        <button className="btn-ver" onClick={toggleFav}>{fav ? 'Quitar favorito' : 'Favorito'}</button>
        {propio && (
          <button
            className="btn-borrar"
            onClick={async () => {
              const ok = window.confirm('¿Deseas borrar este juego?')
              if (!ok) return
              await api.delete(`/api/juegos/${_id}`)
              if (onDeleted) onDeleted(_id)
            }}
          >
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}

export default TarjetaJuego;