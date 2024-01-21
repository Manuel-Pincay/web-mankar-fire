import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, setDoc, updateDoc, collectionData, DocumentData } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import Usuarios from 'src/app/Interfaces/users.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }



  
  /* login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  } */

  /* async login({ email, password }: any): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const usuario = await this.getUsuarioByEmail(email);

      if (usuario && usuario.role === 'admin') {
        return usuario;
      } else {
        // Si el usuario no es administrador, puedes lanzar un error o devolver null
        throw new Error('Acceso no autorizado');
      }
    } catch (error) {
      // Manejo de errores, por ejemplo, puedes lanzar un nuevo error o manejarlo de otra manera
      throw new Error('Error durante el inicio de sesión: ' + error);
    }
  }

  private async getUsuarioByEmail(email: string): Promise<any> {
    const usuarioDocRef = collection(this.firestore, 'users');
    const data = await collectionData(usuarioDocRef, { idField: 'email' });
    const usuario = data.find((user) => user.email === email);
    return usuario;
  }
   */
  login({ email, password }: any): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(() => this.getUsuarioByEmail(email)),
      catchError((error) => {
        // Puedes manejar errores aquí, por ejemplo, lanzar un nuevo error o devolver null
        return throwError('Acceso no autorizado');
      })
    );
  }

  private getUsuarioByEmail(email: string): Observable<any> {
    const usuarioDocRef = collection(this.firestore, 'users');
    return collectionData(usuarioDocRef, { idField: 'email' }).pipe(
      switchMap(async (data: DocumentData[]) => {
        const usuario = data.find((user) => user['email'] === email);
        if (usuario && usuario['rool'] === 'admin') {
          localStorage.setItem('userRole', 'admin');
          return usuario;
        } else {
          this.auth.signOut();
          throw new Error('Acceso no autorizado');
        }
      }),
      catchError((error) => {
        // Puedes manejar errores aquí, por ejemplo, lanzar un nuevo error o devolver null
        return throwError('Acceso no autorizado');
      })
    );
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('userRole');
  }

  logout() {
    return signOut(this.auth);
  }

  addUsuario(usuario: Usuarios) {
    const usuariosRef = collection(this.firestore, 'users');
    // Asume que 'estado' es un campo que indica si el usuario está activo o no
    usuario.estado = true;

    return addDoc(usuariosRef, usuario);
  }

  getUsuario(): Observable<any> {
    const usuarioDocRef = collection(this.firestore, `users`);
    return collectionData(usuarioDocRef, { idField: 'email' }).pipe(
      map((data: any[]) => {
        return data.map(usuario => {
          return {
            ...usuario,
          };
        });
      })
    ) as Observable<any>;
  }

  updateUsuario(email: string, newData: any) {
    const usuarioDocRef = doc(this.firestore, `users/${email}`);
 
    return setDoc(usuarioDocRef, newData);
  }

  deleteUsuario(email: string) {
    const usuarioDocRef = doc(this.firestore, `users/${email}`);
 
    return updateDoc(usuarioDocRef, { estado: false });
  }


}