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
  updateDoc,
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
      estado: true,
    };
  
    const docRef = doc(rutasCollection, nuevoId.toString());

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
  getRutasDel(): Observable<Rutas[]> {
    const rutasRef = collection(this.firestore, 'rutas');
    return collectionData(rutasRef, { idField: 'id' }).pipe(
      map((data: any[]) => {
        return data
          .filter((ruta) => ruta.estado === false)
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
    return updateDoc(rutaDocRef, { estado: false }).then(() => {
      this.logService.createlog({
        action: 'Eliminada',
        details: 'Ruta eliminada',
        registro: ruta,
      });
    });
  }

  eliminarTotal(ruta: Rutas) {
    const rutaDocRef = doc(this.firestore, `rutas/${ruta.id}`);

    // Utiliza deleteDoc para eliminar definitivamente el documento
    return deleteDoc(rutaDocRef).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      this.logService.createlog({
        action: 'Eliminado',
        details: 'Ruta eliminada total',
        registro: ruta,
      });
    });
  }

  resetRuta(ruta: Rutas) {
    const rutaDocRef = doc(this.firestore, `rutas/${ruta.id}`);
    return updateDoc(rutaDocRef, { estado: true }).then(() => {
      this.logService.createlog({
        action: 'Recuperada',
        details: 'Ruta recuperada',
        registro: ruta,
      });
    });
  }
}