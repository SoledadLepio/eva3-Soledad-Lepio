import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./Conexion";
import { Persona } from "../Interfaces/IPersona";
import {doc,updateDoc} from "firebase/firestore";
import {deleteDoc} from "firebase/firestore";


const coleccion = collection(db, "personas");

export const registrarPersona = async(p:Persona)=>{
const docRef = await addDoc(collection(db, "personas"), p);
}

export const actualizarPersona = async (p: Persona) => {
  if (!p.id) return; // si no hay id, no se puede actualizar

  const ref = doc(db, "personas", p.id);
  const personaSinId = { ...p };
  delete personaSinId.id;

  await updateDoc(ref, personaSinId);
};

export const eliminarPersona = async(id: string) => {
    const ref = doc(db, "personas", id);
    await deleteDoc(ref);
}

export const obtenerPersonas = async()=>{
    const querySnapshot = await getDocs(collection(db, "personas"));
    let listado:Persona[] = []
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  let persona:Persona & {id: string} = {
    id:doc.id,
    nombre: doc.data().nombre,
    apellido: doc.data().apellido,
    edad: doc.data().edad,
    pokemon: doc.data().pokemon,
    descripcion: doc.data().descripcion,
    fechaNacimiento: doc.data().fechaNacimiento
  }
  listado.push(persona)
});
    return listado
}