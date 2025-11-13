// Página de estadísticas personales del usuario.
// Renderiza el componente que calcula y muestra métricas.
import React from 'react';
import EstadisticasPersonales from '../components/EstadisticasPersonales';

function Estadisticas() {
  return (
    <div className="pagina-estadisticas">
      <EstadisticasPersonales />
    </div>
  );
}

export default Estadisticas;