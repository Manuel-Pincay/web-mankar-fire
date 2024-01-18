// repostajes.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Repostaje from '../Interfaces/repostajes.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RepostajesService {

  constructor(private firestore: Firestore) { }

  addRepostaje(repostaje: Repostaje) {
    const repostajesRef = collection(this.firestore, 'DBcombustible');
    repostaje.estado = true; // Establece el estado como true por defecto

    const docRef = addDoc(repostajesRef, repostaje);

    return docRef.then((doc) => {
      repostaje.key = doc.id;
      return setDoc(doc, repostaje); // Actualiza el documento con la 'key' establecida
    });
  }

  getRepostajes(): Observable<Repostaje[]> {
    const repostajesRef = collection(this.firestore, 'DBcombustible');
    return collectionData(repostajesRef, { idField: 'key' }).pipe(
      map((data: any[]) => {
        return data .filter(repostaje => repostaje.estado === true).map(repostaje => {
          return {
            ...repostaje,
            fecha: repostaje.fecha ? repostaje.fecha.toDate() : null,
          };
        });
      })
    ) as Observable<Repostaje[]>;
  }

  updateRepostaje(repostaje: Repostaje) {
    const repostajeDocRef = doc(this.firestore, `DBcombustible/${repostaje.key}`);
    // Utiliza setDoc para actualizar el documento
    return setDoc(repostajeDocRef, repostaje);
  }

  deleteRepostaje(repostaje: Repostaje) {
    const repostajeDocRef = doc(this.firestore, `DBcombustible/${repostaje.key}`);
    return updateDoc(repostajeDocRef, { estado: false });
  }
}
