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
  where,
  getDocs,
  and,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import Mantenimientos from '../Interfaces/mantenimientos.interfaces';
import { LogService } from './logs.service';
import { getStorage, ref, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class MantenimientosService {
  constructor(private firestore: Firestore, private logService: LogService,  ) {}

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
  getMantenimientosDel(): Observable<Mantenimientos[]> {
    const mantenimientosRef = collection(this.firestore, 'mantenimientos');
    const orderedQuery = query(mantenimientosRef, orderBy('fecha', 'desc'));

    return collectionData(orderedQuery, { idField: 'key' }).pipe(
      map((data: any[]) => {
        return data
          .filter((mantenimiento) => mantenimiento.estado === false)
          .map((mantenimiento) => {
            return {
              ...mantenimiento,
              fecha: mantenimiento.fecha ? mantenimiento.fecha.toDate() : null,
            };
          });
      })
    ) as Observable<Mantenimientos[]>;
  }

  getMantenimientosPorUnidadYTipo(
    unidad: string,
    tipoMantenimiento: string
  ): Observable<any[]> {
    const mantenimientosQuery = query(
      collection(this.firestore, 'mantenimientos'),
      and(
        where('placa', '==', unidad),
        where('descripcion', '==', tipoMantenimiento)
      )
    );

    return from(getDocs(mantenimientosQuery)).pipe(
      map((querySnapshot) => {
        const mantenimientos: any[] = [];
        querySnapshot.forEach((doc) => {
          mantenimientos.push(doc.data());
        });
        return mantenimientos;
      })
    );
  }

  getMantenimientosPorUnidad(placa: string): Observable<Mantenimientos[]> {
    const mantenimientosQuery = query(
      collection(this.firestore, 'mantenimientos'),
      where('placa', '==', placa)
    );

    return from(getDocs(mantenimientosQuery)).pipe(
      map((querySnapshot) => {
        const mantenimientos: any[] = [];
        querySnapshot.forEach((doc) => {
          mantenimientos.push(doc.data());
        });
        return mantenimientos;
      })
    );
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

  eliminarMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientoDocRef = doc(
      this.firestore,
      `mantenimientos/${mantenimiento.key}`
    );

    // Utiliza deleteDoc para eliminar definitivamente el documento
    return deleteDoc(mantenimientoDocRef).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      this.logService.createlog({
        action: 'Eliminado',
        details: 'Mantenimiento eliminado total',
        registro: mantenimiento,
      });
    });
  }
/* 
  eliminarMantenimiento(mantenimiento: Mantenimientos) {
    const storage = getStorage();
    const mantenimientoDocRef = doc(
      this.firestore,
      `mantenimientos/${mantenimiento.key}`
    );

    // Utiliza deleteDoc para eliminar definitivamente el documento
    return deleteDoc(mantenimientoDocRef)
      .then(() => {
        // Extrae el nombre del archivo de la URL de imagen
        const imagenNombre = mantenimiento.imagen.split('/').pop();
        // Construye la referencia al archivo en Firebase Storage
        const storageRef = ref(
          this.storage,
          `mantenimientosfiles/${mantenimiento.imagen}`
        );
        // Utiliza deleteObject para eliminar la imagen asociada al mantenimiento
        return deleteObject(storageRef)
          .then(() => {
            // Llama a createlog para registrar la transacción con el objeto completo
            this.logService.createlog({
              action: 'Eliminado',
              details: 'Mantenimiento y su imagen eliminados',
              registro: mantenimiento,
            });
          })
          .catch((error) => {
            console.error('Error al eliminar la imagen:', error);
          });
      })
      .catch((error) => {
        console.error('Error al eliminar el mantenimiento:', error);
      });
  } */

  resetMantenimiento(mantenimiento: Mantenimientos) {
    const mantenimientoDocRef = doc(
      this.firestore,
      `mantenimientos/${mantenimiento.key}`
    );

    // Utiliza updateDoc para cambiar el estado a false
    return updateDoc(mantenimientoDocRef, { estado: true }).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      return this.logService.createlog({
        action: 'Recuperado',
        details: 'Mantenimiento recuperado',
        registro: mantenimiento,
      });
    });
  }
}
