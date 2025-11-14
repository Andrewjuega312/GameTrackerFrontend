// Página para crear un nuevo juego usando el formulario reutilizable.
import React from 'react';
import FormularioJuego from '../components/FormularioJuego';

function AgregarJuego() {
  return (
    <div className="pagina-agregar">
      <FormularioJuego />
    </div>
  );
}

export default AgregarJuego;