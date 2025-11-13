// Cálculo y visualización de estadísticas personales basadas en la biblioteca de juegos.
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/EstadisticasPersonales.css';

function EstadisticasPersonales() {
  const [estadisticas, setEstadisticas] = useState({
    totalJuegos: 0,
    juegosCompletados: 0,
    totalHoras: 0,
    puntuacionPromedio: 0
  });
  const [cargando, setCargando] = useState(true);

  // Al montar, recupera juegos y calcula totales y promedios.
  useEffect(() => {
    const calcularEstadisticas = async () => {
      try {
        const respuesta = await api.get('/api/juegos');
        const juegos = respuesta.data;
        
        const totalJuegos = juegos.length;
        const juegosCompletados = juegos.filter(juego => juego.completado).length;
        const totalHoras = juegos.reduce((total, juego) => total + juego.horasJugadas, 0);
        
        let puntuacionPromedio = 0;
        if (totalJuegos > 0) {
          puntuacionPromedio = juegos.reduce((total, juego) => total + juego.puntuacion, 0) / totalJuegos;
        }
        
        setEstadisticas({
          totalJuegos,
          juegosCompletados,
          totalHoras,
          puntuacionPromedio: puntuacionPromedio.toFixed(1)
        });
        
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setCargando(false);
      }
    };

    calcularEstadisticas();
  }, []);

  if (cargando) return <div className="cargando">Calculando estadísticas...</div>;

  return (
    <div className="estadisticas-container">
      <h2>Mis Estadísticas</h2>
      <div className="tarjetas-estadisticas">
        <div className="tarjeta-estadistica">
          <h3>Total de Juegos</h3>
          <p className="numero">{estadisticas.totalJuegos}</p>
        </div>
        <div className="tarjeta-estadistica">
          <h3>Juegos Completados</h3>
          <p className="numero">{estadisticas.juegosCompletados}</p>
          <p className="porcentaje">
            {estadisticas.totalJuegos > 0 
              ? `(${Math.round((estadisticas.juegosCompletados / estadisticas.totalJuegos) * 100)}%)` 
              : '(0%)'}
          </p>
        </div>
        <div className="tarjeta-estadistica">
          <h3>Horas Jugadas</h3>
          <p className="numero">{estadisticas.totalHoras}</p>
        </div>
        <div className="tarjeta-estadistica">
          <h3>Puntuación Media</h3>
          <p className="numero">{estadisticas.puntuacionPromedio}</p>
          <div className="estrellas">
            {[1, 2, 3, 4, 5].map(valor => (
              <span 
                key={valor} 
                className={valor <= Math.round(estadisticas.puntuacionPromedio) ? 'estrella-llena' : 'estrella-vacia'}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasPersonales;