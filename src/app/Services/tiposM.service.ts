// tiposM.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import ListatiposM from '../Interfaces/tiposmant.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TiposMService {

  constructor(private firestore: Firestore) { }

  addTipoM(tipoM: ListatiposM) {
    const tiposMRef = collection(this.firestore, 'listatiposM');
    tipoM.estado = true;
  
    return addDoc(tiposMRef, tipoM);
  }

  getTiposM(): Observable<ListatiposM[]> {
    const tiposMRef = collection(this.firestore, 'listatiposM');

    return collectionData(tiposMRef, { idField: 'nombre' }).pipe(
      map((data: any[]) => {
        return data.map(tipoM => {
          return {
            ...tipoM,
          };
        });
      })
    ) as Observable<ListatiposM[]>;
  }

  updateTipoM(tipoM: ListatiposM) {
    const tipoMDocRef = doc(this.firestore, `listatiposM/${tipoM.nombre}`);
 
    return setDoc(tipoMDocRef, tipoM);
  }

  deleteTipoM(tipoM: ListatiposM) {
    const tipoMDocRef = doc(this.firestore, `listatiposM/${tipoM.nombre}`);
 
    return updateDoc(tipoMDocRef, { estado: false });
  }
}