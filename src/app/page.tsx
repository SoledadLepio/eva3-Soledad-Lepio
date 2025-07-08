'use client'
import { useEffect, useState } from "react";
import { Persona } from "./Interfaces/IPersona";
import MostrarPersonas from "./MostrarPersonas";


const  initialStatePersona:Persona = {
  apellido: "",
  nombre: "",
  edad: 0,
  pokemon: "",
  descripcion: ""
}
export default function Home() {
  const miStorage = window.localStorage
  const [persona, setPersona] = useState(initialStatePersona)
  const [personaA,setPersonaA] = useState(initialStatePersona)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [eNombre, setENombre] = useState("")
  const [editIndex, setEditIndex] = useState <number | null> (null) // se agrego el useState para editar el index
  const [refrescar, setRefrescar] = useState(0) // Se agrego al useState de refrescar

  useEffect(()=>{
    let listadoStr = miStorage.getItem("personas")
    if(listadoStr != null){
      let listado = JSON.parse(listadoStr)
      setPersonas(listado)
    }
  },[refrescar]) //se agrego el rrefrescar

  const handleRegistrar = ()=>{
    const nuevasPersonas = [...personas, persona] //se agrego esto
    setPersonas(nuevasPersonas)//se agrego esto
    miStorage.setItem("personas", JSON.stringify(nuevasPersonas))//se agrego esto
    setPersona(initialStatePersona)//agregue esto
    setRefrescar(r=> r+1)//agregue esto
  }
  const handlePersona = (name:string,value:string)=>{
    const parsedValue = name == "edad" ? parseInt (value) || 0 : value //agregue esto
    setPersona(
      { ...persona, [name] : value  }
    )
    if (name == "nombre" && value.length<3){
      setENombre("El nombre debe tener 3 caracteres como minimo")
    }else if(name=="nombre" && value.length>=3){
      setENombre("")
    }
  }

  const handlePersonaA= (name:string, value:string) => { //Agregue esto
    setPersonaA({...personaA, [name]: value }) //Agregue esto
  }

  const handleActualizar = ()=>{
    if (editIndex !== null) { //Agregue esto
      const personasActualizadas = [...personas]//Agregue esto
      personasActualizadas[editIndex] = personaA//Agregue esto
      setPersonas(personasActualizadas)//Agregue esto
      miStorage.setItem("personas", JSON.stringify(personasActualizadas))//Agregue esto
      setPersonaA(initialStatePersona)//Agregue esto
      setEditIndex(null)
      setRefrescar(r => r + 1)
    }
  }
  const traerPersona = (p:Persona, index:number)=>{
    setPersonaA(p)
    setEditIndex(index)
  }

  const eliminarPersona = (index:number) => { //Agregue esto
    const nuevasPersonas = personas.filter((_,i) => i !== index) //Agregue esto
    setPersonas(nuevasPersonas) //Agregue esto
    miStorage.setItem("personas", JSON.stringify(nuevasPersonas)) //Agregue esto
    setRefrescar(r=> r+1) //nuevo
  }


  return (
        <>
        <form>
          <h1>{persona.nombre} {persona.apellido}</h1>
          <label>Nombre</label><br/>
          <input
              name="nombre" 
              type="text" 
              placeholder="Nombre"
              onChange={(e)=>{handlePersona(e.currentTarget.name,e.currentTarget.value)}}/><br/>
          <span>{eNombre}</span>
          
          <label>Apellido</label><br/>
          <input 
              name="apellido"
              type="text"
              placeholder="Apellido"
              onChange={(e)=>{handlePersona(e.currentTarget.name,e.currentTarget.value)}}/><br/>
          <span></span>

          <label>Edad</label><br /> 
          <input
            name="edad"
            type="number"
            placeholder="Edad"
            value={persona.edad}
            onChange={(e) => handlePersona(e.currentTarget.name, e.currentTarget.value)}
          /><br />

          <label>Elige tu Pokemon favorito</label> <br />
          <select
            name="pokemon"
            value={persona.pokemon}
            onChange={(e) => handlePersona(e.currentTarget.name, e.currentTarget.value)}>
            
            <option value="">-- ¿Cual es tu inicial favorito?</option>
            <option value="Charmander">Charmander</option>
            <option value="Bulbasaur">Bulbasaur</option>
            <option value="Squirtle">Squirtle</option>
            <option value="Cyndaquil">Cyndaquil</option>
            <option value="Chikorita">Chikorita</option>
            <option value="Totodile">Totodile</option>
            <option value="Pikachu">Pikachu</option>
            <option value="Eevee">Eevee</option> 
          </select><br />

          <label>¿Por que es tu inicial favorito?</label><br />
          <textarea 
            name="descripcion"
            placeholder="¿Por que es tu inicial favorito?"
            value={persona.descripcion}
            onChange={(e) => handlePersona(e.currentTarget.name, e.currentTarget.value)}
          ></textarea><br />

          <button 
          onClick={()=>{handleRegistrar()}}>Registrar</button>
        </form>
        <MostrarPersonas saludo = "Hola Como estas" traerPersona = {traerPersona} actualizar={refrescar} onEliminar={eliminarPersona}/>
        <form>
          <h1>{persona.nombre} {persona.apellido}</h1>
          <label>Nombre</label><br/>
          <input
              name="nombre" 
              type="text" 
              placeholder="Nombre"
              value={personaA.nombre}
              onChange={(e)=>{handlePersonaA(e.currentTarget.name,e.currentTarget.value)}}/><br/>
          <span>{eNombre}</span>
          
          <label>Apellido</label><br/>
          <input 
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={personaA.apellido}
              onChange={(e)=>{handlePersonaA(e.currentTarget.name,e.currentTarget.value)}}/><br/>
          <span></span>

          <label>Edad</label><br /> 
          <input
            name="edad"
            type="number"
            placeholder="Edad"
            value={personaA.edad}
            onChange={(e) => handlePersonaA(e.currentTarget.name, e.currentTarget.value)}
          ></input><br/>

          <label>Elige tu puchamon</label><br />
          <select
            name="pokemon"
            value={personaA.pokemon}
            onChange={(e) => handlePersonaA(e.currentTarget.name, e.currentTarget.value)}>
            
            <option value="">-- ¿Cual es tu inicial favorito?</option>
            <option value="Charmander">Charmander</option>
            <option value="Bulbasaur">Bulbasaur</option>
            <option value="Squirtle">Squirtle</option>
            <option value="Cyndaquil">Cyndaquil</option>
            <option value="Chikorita">Chikorita</option>
            <option value="Totodile">Totodile</option>
            <option value="Pikachu">Pikachu</option>
            <option value="Eevee">Eevee</option> 
          </select><br />

          <label>¿Por que es tu inicial favorito?</label><br />
          <textarea 
            name="descripcion"
            placeholder="¿Por que es tu inicial favorito?"
            value={personaA.descripcion}
            onChange={(e) => handlePersonaA(e.currentTarget.name, e.currentTarget.value)}
          ></textarea><br />


          <button 
          onClick={()=>{handleActualizar()}}>Editar</button>
        </form>

        </>
      );
}
