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

@Injectable({
  providedIn: 'root',
})
export class MantenimientosService {
  constructor(private firestore: Firestore, private logService: LogService) {}

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

  /* 
  getMantenimientosPorUnidadYTipo(unidad: string, tipoMantenimiento: string): Observable<any[]> {
  const mantenimientosQuery = query(collection(this.firestore, 'mantenimientos'),
    where('placa', '==', unidad)
  );

  return from(getDocs(mantenimientosQuery)).pipe(
    map((querySnapshot) => {
      const mantenimientos: any[] = [];
      const conteoPorMes: { [mes: number]: number } = {};

      querySnapshot.forEach((doc) => {
        const mantenimiento = doc.data();
        if (mantenimiento['descripcion'] === tipoMantenimiento) {
          const fecha = new Date(mantenimiento['fecha']);
          const mes = fecha.getMonth() + 1; // Meses en JavaScript van de 0 a 11
          conteoPorMes[mes] = (conteoPorMes[mes] || 0) + 1;
        }
      });

      const mantenimientosPorMes = Object.entries(conteoPorMes).map(([mes, cantidad]) => ({
        mes: mes,
        cantidad: cantidad
      }));

      return mantenimientosPorMes;
    })
  );
} */

  /*   getMantenimientosPorUnidadYTipo(unidad: string, tipoMantenimiento: string): Observable<any[]> {
    const mantenimientosQuery = query(collection(this.firestore, 'mantenimientos'),
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
 */
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
