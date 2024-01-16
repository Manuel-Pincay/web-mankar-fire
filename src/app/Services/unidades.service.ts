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
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Unidades from '../Interfaces/unidades.interfaces';

@Injectable({
    providedIn: 'root',
})
export class UnidadesService {
    constructor(private firestore: Firestore) { }

    addUnidad(unidad: Unidades) {
        const unidadesRef = collection(this.firestore, 'flota'); 
        unidad.estado = true;
        const docRef = doc(unidadesRef, unidad.placa);
        return setDoc(docRef, unidad);
    }

    getUnidades(): Observable<Unidades[]> {
        const unidadesRef = collection(this.firestore, 'flota');
        const orderedQuery = query(unidadesRef, orderBy('unidad', 'asc'));
        return collectionData(orderedQuery, { idField: 'placa' }).pipe(
            map((data: any[]) => {
                return data.map((unidad) => {
                    return {
                        ...unidad,
                    };
                });
            })
        ) as Observable<Unidades[]>;
    }

    updateUnidad(unidad: Unidades) {
        const unidadDocRef = doc(this.firestore, `flota/${unidad.placa}`); // Cambia 'mantenimientos' por 'flota'
        // Utiliza setDoc para actualizar el documento
        return setDoc(unidadDocRef, unidad);
    }

    deleteUnidad(unidad: Unidades) {
        const unidadDocRef = doc(this.firestore, `flota/${unidad.placa}`); // Cambia 'mantenimientos' por 'flota'
        return updateDoc(unidadDocRef, { estado: false });
    }
}
