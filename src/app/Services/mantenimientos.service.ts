
// mantenimientos.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import Mantenimientos from '../Interfaces/mantenimientos.interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {

  constructor(private firestore: Firestore) { }
  /* 
    addMantenimiento(mantenimiento: Mantenimientos) {
      mantenimiento.key = uuidv4(); 
  
      const mantenimientosRef = collection(this.firestore, 'mantenimientos');
      return addDoc(mantenimientosRef, mantenimiento);
    } */
  addMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientosRef = collection(this.firestore, 'mantenimientos');
    mantenimiento.estado = true; // Establece el estado como true por defecto

    const docRef = addDoc(mantenimientosRef, mantenimiento);

    return docRef.then((doc) => {
      mantenimiento.key = doc.id;
      return setDoc(doc, mantenimiento); // Actualiza el documento con la 'key' establecida
    });
  }

  /*   getMantenimientos(): Observable<Mantenimientos[]> {
      const mantenimientosRef = collection(this.firestore, 'mantenimientos');
      return collectionData(mantenimientosRef, { idField: 'key' }) as Observable<Mantenimientos[]>;
    }
   */
  getMantenimientos(): Observable<Mantenimientos[]> {
    const mantenimientosRef = collection(this.firestore, 'mantenimientos');
    return collectionData(mantenimientosRef, { idField: 'key' }).pipe(
      map((data: any[]) => {
        return data.map(mantenimiento => {
          return {
            ...mantenimiento,
            fecha: mantenimiento.fecha ? mantenimiento.fecha.toDate() : null,
          };
        });
      })
    ) as Observable<Mantenimientos[]>;
  }

  updateMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientoDocRef = doc(this.firestore, `mantenimientos/${mantenimiento.key}`);
    // Utiliza setDoc para actualizar el documento
    return setDoc(mantenimientoDocRef, mantenimiento);
  }

  deleteMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientoDocRef = doc(this.firestore, `mantenimientos/${mantenimiento.key}`);
    return deleteDoc(mantenimientoDocRef);
  }
}
