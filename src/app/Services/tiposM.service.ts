// tiposM.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import ListatiposM from '../Interfaces/tiposmant.interfaces';
import { LogService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class TiposMService {
  constructor(private firestore: Firestore, private logService: LogService) { }

  addTipoM(tipoM: ListatiposM) {
    const tiposMRef = collection(this.firestore, 'listatiposM');
    tipoM.estado = true;
    const docRef = doc(tiposMRef, tipoM.nombre);

    // Llama a createlog para registrar la transacción con el objeto completo
    return setDoc(docRef, tipoM).then(() => {
      this.logService.createlog({
        action: 'Agregado',
        details: 'Nuevo tipo de mantenimiento agregado',
        registro: tipoM,
      });
    });
  }

  getTiposM(): Observable<ListatiposM[]> {
    const tiposMRef = collection(this.firestore, 'listatiposM');

    return collectionData(tiposMRef, { idField: 'nombre' }).pipe(
      map((data: any[]) => {
        return data
        .filter((tipoM) => tipoM.estado === true)
        .map(tipoM => {
          return {
            ...tipoM,
          };
        });
      })
    ) as Observable<ListatiposM[]>;
  }


  getTiposMDel(): Observable<ListatiposM[]> {
    const tiposMRef = collection(this.firestore, 'listatiposM');

    return collectionData(tiposMRef, { idField: 'nombre' }).pipe(
      map((data: any[]) => {
        return data
        .filter((tipoM) => tipoM.estado === false)
        .map(tipoM => {
          return {
            ...tipoM,
          };
        });
      })
    ) as Observable<ListatiposM[]>;
  }

  
  updateTipoM(tipoM: ListatiposM) {
    const tipoMDocRef = doc(this.firestore, `listatiposM/${tipoM.nombre}`);
 
    // Llama a createlog para registrar la transacción con el objeto completo
    return setDoc(tipoMDocRef, tipoM).then(() => {
      this.logService.createlog({
        action: 'Actualizado',
        details: 'Tipo de mantenimiento actualizado',
        registro: tipoM,
      });
    });
  }

  deleteTipoM(tipoM: ListatiposM) {
    const tipoMDocRef = doc(this.firestore, `listatiposM/${tipoM.nombre}`);
 
    // Llama a createlog para registrar la transacción con el objeto completo
    return updateDoc(tipoMDocRef, { estado: false }).then(() => {
      this.logService.createlog({
        action: 'Eliminado',
        details: 'Tipo de mantenimiento eliminado',
        registro: tipoM,
      });
    });
  }

  eliminarTotal(tipoM: ListatiposM)  {
    const tipoMDocRef = doc(this.firestore, `listatiposM/${tipoM.nombre}`);
    return deleteDoc(tipoMDocRef).then(() => { 
      this.logService.createlog({
        action: 'Eliminado',
        details:  'Tipo de mantenimiento eliminado total',
        registro: tipoM,
      });
    });
  }

  resetTipoM(tipoM: ListatiposM) {
    const tipoMDocRef = doc(this.firestore, `listatiposM/${tipoM.nombre}`);
    return updateDoc(tipoMDocRef, { estado: true }).then(() => {
      this.logService.createlog({
        action: 'Recuperado',
        details: 'Tipo de mantenimiento recuperado',
        registro: tipoM,
      });
    });
  }
}