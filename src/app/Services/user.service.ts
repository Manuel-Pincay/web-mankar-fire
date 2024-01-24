import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, setDoc, updateDoc, collectionData, DocumentData } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { getDocs, query, where } from 'firebase/firestore';
import Usuarios from 'src/app/Interfaces/users.interfaces';
import { LogService } from './logs.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth, private firestore: Firestore, private logService: LogService) { }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }


 
  login({ email, password }: any): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(() => this.getUsuarioByEmail(email)),
      catchError((error) => {
        // Puedes manejar errores aquí, por ejemplo, lanzar un nuevo error o devolver null
        return throwError('Acceso no autorizado');
      })
    );
  }



  getUsuarioByEmail(email: string): Observable<any> {
    const usuarioDocRef = collection(this.firestore, 'users');
    return collectionData(usuarioDocRef, { idField: 'email' }).pipe(
      switchMap(async (data: DocumentData[]) => {
        const usuario = data.find((user) => user['email'] === email);
        if (usuario && usuario['rool'] === 'admin') {
          localStorage.setItem('userRole', 'admin');
          return usuario;
        } else if (usuario && usuario['rool'] === 'administrativo') {
          localStorage.setItem('userRole', 'administrativo');
          return usuario;
        }else {
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

  async addUsuario(usuario: Usuarios) {
    const usuariosRef = collection(this.firestore, 'users');
    const correoQuery = query(usuariosRef, where('email', '==', usuario.email));
    const correoDocs = await getDocs(correoQuery);
    if (!correoDocs.empty) {
      console.error('Ya existe un usuario con el mismo correo electrónico');
      return Promise.reject('correo_existente');
    }

    const unidadQuery = query(usuariosRef, where('unidad', '==', usuario.unidad));
    const unidadDocs = await getDocs(unidadQuery);
    if (!unidadDocs.empty) {
      console.error('Ya existe un usuario con la misma unidad');
      return Promise.reject('unidad_asignada');
    }

    const cedulaQuery = query(usuariosRef, where('id', '==', usuario.id));
    const cedulaDocs = await getDocs(cedulaQuery);
    if (!cedulaDocs.empty) {
      console.error('Ya existe un usuario con la misma cédula');
      return Promise.reject('cedula_existente');
    }

    usuario.estado = true;
    const docRef = doc(usuariosRef, usuario.email);
    const user = {
      email: usuario.email,
      password: 'mankar123'
    };
    return setDoc(docRef, usuario).then(() => {
      this.register(user);
      this.logService.createlog({
        action: 'Agregado',
        details: 'Nuevo usuario agregado',
        registro: usuario,
      });
    });
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

  async updateUsuario(email: string, newData: any) {
    const usuariosRef = collection(this.firestore, 'users');

    const unidadQuery = query(usuariosRef, where('unidad', '==', newData.unidad));
    const unidadDocs = await getDocs(unidadQuery);
    if (!unidadDocs.empty && unidadDocs.docs[0].id !== email) {
      console.error('Ya existe un usuario con la misma unidad');
      return Promise.reject('unidad_asignada');
    }
  
    const cedulaQuery = query(usuariosRef, where('id', '==', newData.id));
    const cedulaDocs = await getDocs(cedulaQuery);
    if (!cedulaDocs.empty && cedulaDocs.docs[0].id !== email) {
      console.error('Ya existe un usuario con la misma cédula');
      return Promise.reject('cedula_existente');
    }

    const usuarioDocRef = doc(this.firestore, `users/${email}`);
  
  // Utiliza setDoc para actualizar el documento
  return setDoc(usuarioDocRef, newData).then(() => {
    // Llama a createlog para registrar la transacción con el objeto completo
    return this.logService.createlog({
      action: 'Actualizado',
      details: 'Usuario actualizado',
      registro: newData,
    });
  });
  }
  async updateUsuario2(email: string, newData: any) {
    const usuariosRef = collection(this.firestore, 'users');

    const usuarioDocRef = doc(this.firestore, `users/${email}`);
  
  // Utiliza setDoc para actualizar el documento
  return setDoc(usuarioDocRef, newData).then(() => {
    // Llama a createlog para registrar la transacción con el objeto completo
    return this.logService.createlog({
      action: 'Eliminado',
      details: 'Usuario eliminado',
      registro: newData,
    });
  });
  }
  

deleteUsuario(email: string) {
    const usuarioDocRef = doc(this.firestore, `users/${email}`);

    // Llama a createlog para registrar la transacción con el objeto completo
    return updateDoc(usuarioDocRef, { estado: false }).then(() => {
        this.logService.createlog({
            action: 'Eliminado',
            details: 'Usuario eliminado',
            userEmail: email,
        });
    });
}

  async restablecerUsuario(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
}