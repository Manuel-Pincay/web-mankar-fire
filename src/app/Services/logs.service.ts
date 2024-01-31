 
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  setDoc,
  Timestamp,
  query,
  orderBy,
  collectionData,
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async createlog(log: any) {
    const user = await this.getCurrentUser();
    const fechaActual = Timestamp.now();

    const logEntry = {
      user: user ? user.email : 'Usuario no autenticado',
      fecha: fechaActual,
      data: log,
    };

    const logRef = collection(this.firestore, 'log');
    return addDoc(logRef, logEntry);
  }

  private async getCurrentUser() {
    const userCredential = await this.auth.currentUser;
    return userCredential ? userCredential : null;
  }

  getLogs(): Observable<any[]> {
    const logsRef = collection(this.firestore, 'log');
    const orderedQuery = query(logsRef, orderBy('fecha', 'desc'));

    return collectionData(orderedQuery, { idField: 'logId' }) as Observable<any[]>;
  }
  getLogsMovil(): Observable<any[]> {
    const logsRef = collection(this.firestore, 'logs');
    const orderedQuery = query(logsRef, orderBy('fecha', 'desc'));

    return collectionData(orderedQuery, { idField: 'logId' }) as Observable<any[]>;
  }
}
