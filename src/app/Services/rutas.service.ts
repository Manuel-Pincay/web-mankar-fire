// rutas.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, setDoc, getDocs, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import Rutas from '../Interfaces/rutas.interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor(private firestore: Firestore) { }

  /*  addRuta(ruta: Rutas) {
    const rutasRef = collection(this.firestore, 'rutas');
    ruta.estado = true; 
    const docRef = doc(rutasRef, ruta.id);
    return setDoc(docRef, ruta); 
  }  */

  async guardarRuta(salida: string, llegada: string, npeajes: number): Promise<void> {
    const rutasCollection = collection(this.firestore, 'rutas');
    const querySnapshot = await getDocs(query(rutasCollection, orderBy('id', 'desc'), limit(1)));

    let nuevoId = 1;
    if (!querySnapshot.empty) {
      const lastDocument = querySnapshot.docs[0];
      nuevoId = lastDocument.data()['id'] + 1;
    }

    const nombre = `${salida} - ${llegada}`;
    const nuevaRuta: Rutas = {
      id: nuevoId,
      salida,
      llegada,
      npeajes,
      nombre,
      estado: true,
  
    };

    const docRef = doc(rutasCollection, nuevoId.toString());
    return setDoc(docRef, nuevaRuta);
  }

 

  getRutas(): Observable<Rutas[]> {
    const rutasRef = collection(this.firestore, 'rutas');
    return collectionData(rutasRef, { idField: 'id' }).pipe(
      map((data: any[]) => {
        return data.map(ruta => {
          return {
            ...ruta,
          };
        });
      })
    ) as Observable<Rutas[]>;
  }

  updateRuta(ruta: Rutas) {
    const rutaDocRef = doc(this.firestore, `rutas/${ruta.id}`);
    // Utiliza setDoc para actualizar el documento
    return setDoc(rutaDocRef, ruta);
  }

  deleteRuta(ruta: Rutas) {
    const rutaDocRef = doc(this.firestore, `rutas/${ruta.id}`);
    return deleteDoc(rutaDocRef);
  }
}
