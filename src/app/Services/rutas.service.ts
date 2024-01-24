import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  deleteDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import Rutas from '../Interfaces/rutas.interfaces';
import { LogService } from './logs.service';

@Injectable({
  providedIn: 'root',
})
export class RutasService {

  constructor(private firestore: Firestore, private logService: LogService) { }
 
  async guardarRuta(ruta: Rutas): Promise<void> {
    const rutasCollection = collection(this.firestore, 'rutas');
    const querySnapshot = await getDocs(query(rutasCollection, orderBy('id', 'desc'), limit(1)));
  
    let nuevoId = 1;
    if (!querySnapshot.empty) {
      const lastDocument = querySnapshot.docs[0];
      nuevoId = lastDocument.data()['id'] + 1;
    }
  
    const nombre = `${ruta.salida} - ${ruta.llegada}`;
    const nuevaRuta: Rutas = {
      id: nuevoId,
      salida: ruta.salida,
      llegada: ruta.llegada,
      npeajes: ruta.npeajes,
      nombre,
      estado: true, // Puedes ajustar esto según tus necesidades o lógica específica
    };
  
    const docRef = doc(rutasCollection, nuevoId.toString());

    // Llama a createlog para registrar la transacción con el objeto completo
    return setDoc(docRef, nuevaRuta).then(() => {
      this.logService.createlog({
        action: 'Guardada',
        details: 'Nueva ruta guardada',
        registro: nuevaRuta,
      });
    });
  }

  getRutas(): Observable<Rutas[]> {
    const rutasRef = collection(this.firestore, 'rutas');
    return collectionData(rutasRef, { idField: 'id' }).pipe(
      map((data: any[]) => {
        return data
          .filter((ruta) => ruta.estado === true)
          .map((ruta) => {
            return {
              ...ruta,
            };
          });
      })
    ) as Observable<Rutas[]>;
  }

 
  updateRuta(ruta: Rutas) {
    const rutaDocRef = doc(this.firestore, `rutas/${ruta.id}`);
    const nombre = `${ruta.salida} - ${ruta.llegada}`;
    const rutaActualizada: Rutas = {
      ...ruta,
      nombre: nombre,
    };

    // Llama a createlog para registrar la transacción con el objeto completo
    return setDoc(rutaDocRef, rutaActualizada).then(() => {
      this.logService.createlog({
        action: 'Actualizada',
        details: 'Ruta actualizada',
        registro: rutaActualizada,
      });
    });
  }

  deleteRuta(ruta: Rutas) {
    const rutaDocRef = doc(this.firestore, `rutas/${ruta.id}`);

    // Llama a createlog para registrar la transacción con el objeto completo
    return deleteDoc(rutaDocRef).then(() => {
      this.logService.createlog({
        action: 'Eliminada',
        details: 'Ruta eliminada',
        registro: ruta,
      });
    });
  }
}