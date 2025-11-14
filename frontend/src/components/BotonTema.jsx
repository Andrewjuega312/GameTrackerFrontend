// Un botón simple que alterna el tema de la aplicación.
import React, { useContext } from 'react';
import { TemaContext } from '../context/TemaContext';
import '../styles/BotonTema.css';

const BotonTema = () => {
  const { modoOscuro, toggleTema } = useContext(TemaContext);

  return (
    <button
      className="boton-tema"
      onClick={toggleTema} // Al hacer clic, cambiamos entre oscuro y claro
      aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Mostramos un iconito distinto según el modo actual */}
      {modoOscuro ? '☀️' : '🌙'}
    </button>
  );
};

export default BotonTema;