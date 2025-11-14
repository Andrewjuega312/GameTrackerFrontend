// Página de inicio que muestra la biblioteca de juegos con filtros.
import React from 'react';
import BibliotecaJuegos from '../components/BibliotecaJuegos';

function Inicio() {
  return (
    <div className="pagina-inicio">
      <BibliotecaJuegos />
    </div>
  );
}

export default Inicio;