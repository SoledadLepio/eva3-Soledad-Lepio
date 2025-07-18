import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./Conexion";
import { Persona } from "../Interfaces/IPersona";


export const registrarPersona = async(p:Persona)=>{

// Add a new document with a generated id.
const docRef = await addDoc(collection(db, "personas"), p);
console.log("Document written with ID: ", docRef.id);

}

export const obtenerPersonas = async()=>{
    const querySnapshot = await getDocs(collection(db, "personas"));
    let listado:Persona[] = []
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  let persona:Persona = {
    nombre: doc.data().nombre,
    apellido: doc.data().apellido,
    edad: doc.data().edad,
    pokemon: doc.data().pokemon,
    descripcion: doc.data().descripcion,
    fechaNacimiento: doc.data().fechaNacimiento
  }
  listado.push(persona)
  console.log(doc.id, " => ", doc.data());
});
    return listado
}