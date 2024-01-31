// unidades.service.ts
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
  orderBy,
  query,
  DocumentSnapshot,
  getDoc,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Unidades from '../Interfaces/unidades.interfaces';
import { LogService } from './logs.service';

@Injectable({
  providedIn: 'root',
})
export class UnidadesService {
  constructor(private firestore: Firestore, private logService: LogService) {}

  async addUnidad(unidad: Unidades) {
    const unidadesRef = collection(this.firestore, 'flota');
    unidad.estado = true;
    const docRef = doc(unidadesRef, unidad.placa);

    const placaQuery = query(unidadesRef, where('placa', '==', unidad.placa));
    const placaDocs = await getDocs(placaQuery);

    if (!placaDocs.empty) {
      console.error('Ya existe una unidad con la misma placa');
      return Promise.reject('placa_existente');
    } 
    return setDoc(docRef, unidad).then(() => {
      this.logService.createlog({
        action: 'Agregada',
        details: 'Nueva unidad agregada',
        registro: unidad,
      });
    });
  }

  getUnidades(): Observable<Unidades[]> {
    const unidadesRef = collection(this.firestore, 'flota');
    const orderedQuery = query(unidadesRef, orderBy('unidad', 'asc'));
    return collectionData(orderedQuery, { idField: 'placa' }).pipe(
      map((data: any[]) => {
        return data
        .filter((unidad) => unidad.estado === true)
        .map((unidad) => {
          return {
            ...unidad,
          };
        });
      })
    ) as Observable<Unidades[]>;
  }
  getUnidadesDel(): Observable<Unidades[]> {
    const unidadesRef = collection(this.firestore, 'flota');
    const orderedQuery = query(unidadesRef, orderBy('unidad', 'asc'));
    return collectionData(orderedQuery, { idField: 'placa' }).pipe(
      map((data: any[]) => {
        return data
        .filter((unidad) => unidad.estado === false)
        .map((unidad) => {
          return {
            ...unidad,
          };
        });
      })
    ) as Observable<Unidades[]>;
  }
  getUnidad(placa: string): Observable<Unidades> {
    const unidadRef = doc(this.firestore, 'flota', placa);

    return from(getDoc(unidadRef)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.data() as Unidades;
        } else {
          throw new Error(`La unidad con placa ${placa} no existe.`);
        }
      })
    );
  }

  updateUnidad(unidad: Unidades) {
    const unidadDocRef = doc(this.firestore, `flota/${unidad.placa}`);
    return setDoc(unidadDocRef, { ...unidad, estado: true }).then(() => {
      this.logService.createlog({
        action: 'Actualizada',
        details: 'Unidad actualizada',
        registro: unidad,
      });
    });
  }

  actualizarKilometrajeUnidad(placa: string, nuevoKilometraje: number): Observable<void> {
    return this.getUnidad(placa).pipe(
      take(1),
      switchMap((unidad: Unidades) => {
        unidad.kmac = nuevoKilometraje;
        return this.updateUnidad(unidad);
      })
    );
  }
  

  deleteUnidad(unidad: Unidades) {
    const unidadDocRef = doc(this.firestore, `flota/${unidad.placa}`);
    return updateDoc(unidadDocRef, { estado: false }).then(() => {
      this.logService.createlog({
        action: 'Eliminada',
        details: 'Unidad eliminada',
        registro: unidad,
      });
    });
  }

  eliminarTotal(unidad: Unidades)  {
    const unidadDocRef = doc(this.firestore, `flota/${unidad.placa}`);
    return deleteDoc(unidadDocRef).then(() => { 
      this.logService.createlog({
        action: 'Eliminado',
        details: 'Unidad eliminada total',
        registro: unidad,
      });
    });
  }

  resetUnidad(unidad: Unidades) {
    const unidadDocRef = doc(this.firestore, `flota/${unidad.placa}`);
    return updateDoc(unidadDocRef, { estado: true }).then(() => {
      this.logService.createlog({
        action: 'Recuperada',
        details: 'Unidad recuperada',
        registro: unidad,
      });
    });
  }
}
