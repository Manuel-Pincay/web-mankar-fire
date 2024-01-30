import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { MainComponent } from './Modules/main/main.component';
import { LoginComponent } from './Modules/login/login.component';
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
import { TablaEstadisticasComponent } from './Modules/tabla-estadisticas/tabla-estadisticas.component';
import { RecuperacionpassComponent } from './Modules/recuperacionpass/recuperacionpass.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogsComponent } from './Modules/logs/logs.component';
import { Tabla1Component } from './Modules/Estadisticas/tabla-1/tabla-1.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ViewmantenimientosComponent,
    ViewrepostajeComponent,
    ViewunidadesComponent,
    ViewrutasComponent,
    ViewusuariosComponent,
    ViewtiposmantenimientosComponent,
    TablaEstadisticasComponent,
    RecuperacionpassComponent,
    SidebarComponent,
    PageNotFoundComponent,
    LogsComponent,
    Tabla1Component,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbModalModule,
    CommonModule,
    
    FormsModule,  
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
