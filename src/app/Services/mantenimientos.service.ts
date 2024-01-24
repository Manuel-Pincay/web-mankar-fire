// mantenimientos.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import Mantenimientos from '../Interfaces/mantenimientos.interfaces';
import { LogService } from './logs.service';

@Injectable({
  providedIn: 'root',
})

export class MantenimientosService {
  constructor(private firestore: Firestore, 
    private logService: LogService ) {}

 /*  addMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientosRef = collection(this.firestore, 'mantenimientos');
    mantenimiento.estado = true;

    const docRef = addDoc(mantenimientosRef, mantenimiento);

    return docRef.then((doc) => {
      mantenimiento.key = doc.id;
      return setDoc(doc, mantenimiento);
    });
    
  } */

  addMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientosRef = collection(this.firestore, 'mantenimientos');
    mantenimiento.estado = true;

    const docRef = addDoc(mantenimientosRef, mantenimiento);

    return docRef.then((doc) => {
      mantenimiento.key = doc.id;
      setDoc(doc, mantenimiento);

      // Llama a createlog para registrar la transacción con el objeto completo
      return this.logService.createlog({
        action: 'Agregado',
        details: 'Nuevo mantenimiento agregado',
        registro: mantenimiento,
      });
    });
  }
 

  getMantenimientos(): Observable<Mantenimientos[]> {
    const mantenimientosRef = collection(this.firestore, 'mantenimientos');
    const orderedQuery = query(mantenimientosRef, orderBy('fecha', 'desc'));

    return collectionData(orderedQuery, { idField: 'key' }).pipe(
      map((data: any[]) => {
        return data
          .filter((mantenimiento) => mantenimiento.estado === true)
          .map((mantenimiento) => {
            return {
              ...mantenimiento,
              fecha: mantenimiento.fecha ? mantenimiento.fecha.toDate() : null,
            };
          });
      })
    ) as Observable<Mantenimientos[]>;
  }

  updateMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientoDocRef = doc(
      this.firestore,
      `mantenimientos/${mantenimiento.key}`
    );
    // Utiliza setDoc para actualizar el documento
    return setDoc(mantenimientoDocRef, mantenimiento).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      return this.logService.createlog({
        action: 'Actualizado',
        details: 'Mantenimiento actualizado',
        registro: mantenimiento,
      });
    });
  
  }

  deleteMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientoDocRef = doc(
      this.firestore,
      `mantenimientos/${mantenimiento.key}`
    );

    // Utiliza updateDoc para cambiar el estado a false
    return updateDoc(mantenimientoDocRef, { estado: false }).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      return this.logService.createlog({
        action: 'Eliminado',
        details: 'Mantenimiento eliminado',
        registro: mantenimiento,
      });
    });
  }
}
