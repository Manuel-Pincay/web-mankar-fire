// repostajes.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Repostaje from '../Interfaces/repostajes.interfaces';
import { LogService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class RepostajesService {

  constructor(private firestore: Firestore,  private logService: LogService) { }


  addRepostaje(repostaje: Repostaje) {
    const repostajesRef = collection(this.firestore, 'DBcombustible');
    repostaje.estado = true; // Establece el estado como true por defecto

    const docRef = addDoc(repostajesRef, repostaje);

    return docRef.then((doc) => {
      repostaje.key = doc.id;
      setDoc(doc, repostaje); // Actualiza el documento con la 'key' establecida

      // Llama a createlog para registrar la transacción con el objeto completo
      return this.logService.createlog({
        action: 'Agregado',
        details: 'Nuevo repostaje agregado',
        registro: repostaje,
      });
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

  getRepostajesDel(): Observable<Repostaje[]> {
    const repostajesRef = collection(this.firestore, 'DBcombustible');
    return collectionData(repostajesRef, { idField: 'key' }).pipe(
      map((data: any[]) => {
        return data .filter(repostaje => repostaje.estado === false).map(repostaje => {
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
    return setDoc(repostajeDocRef, repostaje).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      this.logService.createlog({
        action: 'Actualizado',
        details: 'Repostaje actualizado',
        registro: repostaje,
      });
    });
  }

  deleteRepostaje(repostaje: Repostaje) {
    const repostajeDocRef = doc(this.firestore, `DBcombustible/${repostaje.key}`);
    
    // Utiliza updateDoc para cambiar el estado a false
    return updateDoc(repostajeDocRef, { estado: false }).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      this.logService.createlog({
        action: 'Eliminado',
        details: 'Repostaje eliminado',
        registro: repostaje,
      });
    });
  }
  resetRepostaje(repostaje: Repostaje) {
    const repostajeDocRef = doc(this.firestore, `DBcombustible/${repostaje.key}`);
    
    // Utiliza updateDoc para cambiar el estado a false
    return updateDoc(repostajeDocRef, { estado: true }).then(() => {
      // Llama a createlog para registrar la transacción con el objeto completo
      this.logService.createlog({
        action: 'Recuperado',
        details: 'Repostaje recuperado',
        registro: repostaje,
      });
    });
  }
}