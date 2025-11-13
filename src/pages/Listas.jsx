// Página para gestionar listas personalizadas de juegos.
// Permite crear, listar y eliminar listas del usuario.
import React, { useEffect, useState } from 'react'
import api from '../api/axios'

function Listas() {
  const [listas, setListas] = useState([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  // Trae listas desde el backend.
  const cargar = async () => {
    const r = await api.get('/api/listas')
    setListas(r.data)
  }

  useEffect(() => { cargar() }, [])

  // Crea una nueva lista y refresca el listado.
  const crear = async e => {
    e.preventDefault()
    await api.post('/api/listas', { nombre, descripcion })
    setNombre('')
    setDescripcion('')
    await cargar()
  }

  // Elimina una lista por su id y vuelve a cargar.
  const eliminar = async id => {
    await api.delete(`/api/listas/${id}`)
    await cargar()
  }

  return (
    <div className="contenido">
      <h2>Listas</h2>
      <form onSubmit={crear}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input type="text" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        <button type="submit">Crear</button>
      </form>
      <div>
        {listas.map(l => (
          <div key={l._id}>
            <h3>{l.nombre}</h3>
            <p>{l.descripcion}</p>
            <button className="btn-editar" onClick={() => eliminar(l._id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Listas