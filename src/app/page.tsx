'use client'
import { useEffect, useState } from "react";
import { Persona } from "./Interfaces/IPersona";
import MostrarPersonas from "./MostrarPersonas";
import { registrarPersona, obtenerPersonas } from "./Firebase/Promesas";


const  initialStatePersona:Persona = {
  apellido: "",
  nombre: "",
  edad: 0,
  pokemon: "",
  descripcion: "",
  fechaNacimiento: ""
}
export default function Home() {
  const miStorage = window.localStorage
  const [persona, setPersona] = useState(initialStatePersona)
  const [personaA,setPersonaA] = useState(initialStatePersona)
  const [personas, setPersonas] = useState<Persona[]>([])
  //const [eNombre, setENombre] = useState("")
  const [editIndex, setEditIndex] = useState <number | null> (null) // se agrego el useState para editar el index
  const [refrescar, setRefrescar] = useState(0) // Se agrego al useState de refrescar
  const [errores, setErrores] = useState({
    nombre:"",
    apellido: "",
    edad:"",
    pokemon:"",
    descripcion:"",
    fechaNacimiento:""
  })

  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/ //agregue  esto para la validacion de nombre y apellido

  useEffect(()=>{
    const traerDatos = async () => {
      const listado = await obtenerPersonas()
      setPersonas(listado)
    }
    traerDatos()
  },[refrescar]) //se agrego el refrescar


  const validadores: Record<string, (value: string) => string> = {
    nombre: (value) => {
      if (!soloLetras.test(value)) return "Solo se permiten letras";
      if (value.length < 3) return "Debe tener al menos 3 letras";
      return "";
    },
    apellido: (value) => {
      if (!soloLetras.test(value)) return "Solo se permiten letras";
      if (value.length < 3) return "Debe tener al menos 3 letras";
      return "";
    },
    edad: (value) => {
      const edadNum = parseInt(value);
      if (isNaN(edadNum) || edadNum <= 0 || edadNum > 100) return "Edad debe ser entre 1 y 100";
      return "";
    },
    pokemon: (value) => value === "" ? "Selecciona un Pokémon" : "",
    descripcion: (value) => value.length < 10 ? "Debe tener al menos 10 caracteres" : "",
    fechaNacimiento: (value) => {
      const fechaActual = new Date();
      const fechaIngresada = new Date(value);
      return fechaIngresada > fechaActual ? "No puede ser una fecha futura" : ""
    }
  }

    const validar = (name: string, value: string) => {
    const validador = validadores[name];
    if (validador) {
      const errorMsg = validador(value);
      setErrores((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };


  const handleRegistrar = async ()=>{
    const hayErrores = Object.values(errores).some(error => error !== "")
    if (hayErrores) return
    await registrarPersona(persona)
    setPersona(initialStatePersona)//agregue esto
    setRefrescar(r=> r+1)//agregue esto
  }
  const handlePersona = (name:string,value:string)=>{
    const parsedValue = name == "edad" ? parseInt (value) || 0 : value //agregue esto
    setPersona({ ...persona,[name]: parsedValue})
    validar(name, value)
  }

  const handlePersonaA= (name:string, value:string) => { //Agregue esto
    setPersonaA({...personaA, [name]: name == "edad" ? parseInt(value) || 0 : value }) //Agregue esto
    validar(name, value)
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
          <span>{errores.nombre}</span>
          
          <label>Apellido</label><br/>
          <input 
              name="apellido"
              type="text"
              placeholder="Apellido"
              onChange={(e)=>{handlePersona(e.currentTarget.name,e.currentTarget.value)}}/><br/>
          <span>{errores.apellido}</span>

          <label>Edad</label><br /> 
          <input
            name="edad"
            type="number"
            placeholder="Edad"
            value={persona.edad}
            onChange={(e) => handlePersona(e.currentTarget.name, e.currentTarget.value)}
          /><br />
          <span>{errores.edad}</span>

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
          <span>{errores.pokemon}</span>

          <label>¿Por que es tu inicial favorito?</label><br />
          <textarea 
            name="descripcion"
            placeholder="¿Por que es tu inicial favorito?"
            value={persona.descripcion}
            onChange={(e) => handlePersona(e.currentTarget.name, e.currentTarget.value)}
          ></textarea><br />
          <span>{errores.descripcion}</span>

          <label>Fecha de nacimineto</label>
          <input 
            name="fechaNacimiento"
            type="date"
            value={persona.fechaNacimiento}
            onChange={(e)=> handlePersona(e.currentTarget.name, e.currentTarget.value)}
          /><br/>
          <span>{errores.fechaNacimiento}</span>

          <button 
          type="button"
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
          <span>{errores.nombre}</span>
          
          <label>Apellido</label><br/>
          <input 
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={personaA.apellido}
              onChange={(e)=>{handlePersonaA(e.currentTarget.name,e.currentTarget.value)}}/><br/>
          <span>{errores.apellido}</span>

          <label>Edad</label><br /> 
          <input
            name="edad"
            type="number"
            placeholder="Edad"
            value={personaA.edad}
            onChange={(e) => handlePersonaA(e.currentTarget.name, e.currentTarget.value)}
          ></input><br/>
          <span>{errores.edad}</span>

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
          <span>{errores.pokemon}</span>

          <label>¿Por que es tu inicial favorito?</label><br />
          <textarea 
            name="descripcion"
            placeholder="¿Por que es tu inicial favorito?"
            value={personaA.descripcion}
            onChange={(e) => handlePersonaA(e.currentTarget.name, e.currentTarget.value)}
          ></textarea><br />
          <span>{errores.descripcion}</span>

          <label>Fecha de nacimineto</label>
          <input 
            name="fechaNacimiento"
            type="date"
            value={personaA.fechaNacimiento}
            onChange={(e)=> handlePersonaA(e.currentTarget.name, e.currentTarget.value)}
          /><br/>
          <span>{errores.fechaNacimiento}</span>
          <button 
          type="button"
          onClick={()=>{handleActualizar()}}>Editar</button>
        </form>

        </>
      );
    }
