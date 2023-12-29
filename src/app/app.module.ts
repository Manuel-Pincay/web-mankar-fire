import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { MainComponent } from './Modules/main/main.component';
import { LoginComponent } from './Modules/login/login.component';
import { RegistroComponent } from './Modules/registro/registro.component';
import { environment } from './Environments/environment.prod';
import { MantenimientosComponent } from './Modules/Mantenimientos/mantenimientos/mantenimientos.component';
import { ViewmantenimientosComponent } from './Modules/Mantenimientos/viewmantenimientos/viewmantenimientos.component';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RegistroComponent,
    MantenimientosComponent,
    ViewmantenimientosComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // for firestore
   /*  provideFirebaseApp(() =>
      initializeApp({
        projectId: 'appmovil-mankar',
        appId: '1:1016405250924:web:0cb59f76e0496d15aa9949',
        storageBucket: 'appmovil-mankar.appspot.com',
        apiKey: 'AIzaSyBdmcRBcRsKhYEFBcX1OBLoPfdkDOxx0pA',
        authDomain: 'appmovil-mankar.firebaseapp.com',
        messagingSenderId: '1016405250924',
      })
    ), */
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
