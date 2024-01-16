import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { ViewmantenimientosComponent } from './Modules/Mantenimientos/viewmantenimientos/viewmantenimientos.component';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ViewrepostajeComponent } from './Modules/Repostaje/viewrepostaje/viewrepostaje.component';
import { ViewunidadesComponent } from './Modules/Flotas/viewunidades/viewunidades.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ViewrutasComponent } from './Modules/Rutas/viewrutas/viewrutas.component';
import { ViewusuariosComponent } from './Modules/Usuarios/viewusuarios/viewusuarios.component';
import { ViewtiposmantenimientosComponent } from './Modules/TiposM/viewtiposmantenimientos/viewtiposmantenimientos.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RegistroComponent,
    ViewmantenimientosComponent,
    ViewrepostajeComponent,
    ViewunidadesComponent,
    ViewrutasComponent,
    ViewusuariosComponent,
    ViewtiposmantenimientosComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbModalModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
