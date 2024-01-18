import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, setDoc, updateDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Usuarios from 'src/app/Interfaces/users.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
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