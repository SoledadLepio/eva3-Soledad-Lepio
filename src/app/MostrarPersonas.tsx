import React, { useEffect, useState } from 'react'
import { Persona } from './Interfaces/IPersona'
import { obtenerPersonas } from './Firebase/Promesas'

interface Props{
  saludo : string,
  traerPersona: (p:Persona, index: number) => void, // obtiene los datos del id escogido
  onEliminar: (index: number) => void, //nuevo index number y eliminar
  actualizar: number
}

export const MostrarPersonas = (props:Props) => {
    const miStorage = window.localStorage
    const [personas, setPersonas] = useState<Persona[]>([])
     
    useEffect(()=>{
        const traerDatos = async () => {
          const listado = await obtenerPersonas()
          setPersonas(listado)
        }
        traerDatos()
      },[props.actualizar])
    const queEditar = (index:number) => {
      alert("Le diste a "+index)
      props.traerPersona(personas[index], index)
    }
    const eliminarPersona = (index: number) => {
      props.onEliminar(index)
    }
  return (
    <>
    <h1>{props.saludo}</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Pokemon</th>
            <th>Descripcion</th>
            <th>Fecha de Nacimiento</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p,index)=>{
            return(
              <tr>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.edad}</td>
                <td>{p.pokemon}</td>
                <td>{p.descripcion}</td>
                <td>{p.fechaNacimiento}</td>
                <td><button
                        onClick={()=>queEditar(index)}>Editar</button><button onClick={() => eliminarPersona(index)}>Eliminar</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
export default MostrarPersonas
