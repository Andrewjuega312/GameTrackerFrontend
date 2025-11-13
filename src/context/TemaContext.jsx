// Este contexto controla el tema de la app (modo claro/oscuro).
// También guarda la preferencia en el navegador para recordarla.
import React, { createContext, useState, useEffect } from 'react';

export const TemaContext = createContext();

export const TemaProvider = ({ children }) => {
  // Revisamos si el usuario ya eligió un tema antes.
  const [modoOscuro, setModoOscuro] = useState(() => {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) return temaGuardado === 'oscuro';
    return true;
  });

  // Cada vez que cambiamos el tema, actualizamos clases/atributos y guardamos la preferencia.
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add('modo-oscuro');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('tema', 'claro');
    }
  }, [modoOscuro]);

  // Botón para alternar entre oscuro y claro.
  const toggleTema = () => {
    setModoOscuro(!modoOscuro);
  };

  return (
    <TemaContext.Provider value={{ modoOscuro, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
};