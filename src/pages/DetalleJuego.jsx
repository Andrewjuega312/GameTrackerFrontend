// Página de detalle de juego: muestra info, reseñas y permite puntuar.
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ListaResenas from '../components/ListaResenas';
import FormularioResena from '../components/FormularioResena';
import '../styles/DetalleJuego.css';

function DetalleJuego() {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Carga el juego por id y maneja estados de carga/error.
  useEffect(() => {
    const obtenerJuego = async () => {
      try {
        const respuesta = await api.get(`/api/juegos/${id}`);
        setJuego(respuesta.data);
        setCargando(false);
      } catch (err) {
        setError('Error al cargar el juego');
        setCargando(false);
      }
    };

    obtenerJuego();
  }, [id]);

  // Tras agregar una reseña, refresca los datos del juego.
  const handleResenaNueva = () => {
    const obtenerJuegoActualizado = async () => {
      try {
        const respuesta = await api.get(`/api/juegos/${id}`);
        setJuego(respuesta.data);
      } catch (err) {
        console.error('Error al actualizar juego:', err);
      }
    };
    obtenerJuegoActualizado();
  };

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

  // Actualiza la puntuación del juego desde los botones rápidos.
  const setPuntuacion = async (valor) => {
    try {
      const r = await api.put(`/api/juegos/${id}/puntuacion`, { valor });
      setJuego(r.data);
    } catch (e) {
      console.error('Error al actualizar puntuación:', e);
    }
  };

  if (cargando) return <div className="cargando">Cargando juego...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!juego) return <div className="error">No se encontró el juego</div>;

  return (
    <div className="detalle-juego">
      <div className="cabecera-juego">
        <img src={juego.portada} alt={juego.titulo} className="portada-grande" />
        <div className="info-juego">
          <h2>{juego.titulo}</h2>
          <div className="puntuacion-detalle">{renderEstrellas(juego.puntuacion)}</div>
          <div className="acciones-detalle">
            {[1,2,3,4,5].map(v => (
              <button key={v} className="btn-ver" onClick={() => setPuntuacion(v)}>+{v}</button>
            ))}
          </div>
          <p className="estado-detalle">
            Estado: <span className={juego.completado ? 'completado' : 'pendiente'}>
              {juego.completado ? 'Completado' : 'Pendiente'}
            </span>
          </p>
          <p className="horas-detalle">Horas jugadas: {juego.horasJugadas}</p>
          <div className="acciones-detalle">
            <Link to={`/editar/${juego._id}`} className="btn-editar">Editar</Link>
          </div>
        </div>
      </div>

      <div className="seccion-resenas">
        <ListaResenas juegoId={id} />
        <FormularioResena juegoId={id} onResenaNueva={handleResenaNueva} />
      </div>
    </div>
  );
}

export default DetalleJuego;