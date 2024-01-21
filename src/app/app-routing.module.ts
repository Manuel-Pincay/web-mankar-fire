import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Modules/main/main.component';
import { RegistroComponent } from './Modules/registro/registro.component';
import { LoginComponent } from './Modules/login/login.component';
import {
  AuthGuard,
  canActivate,
  isNotAnonymous,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ViewmantenimientosComponent } from './Modules/Mantenimientos/viewmantenimientos/viewmantenimientos.component';
import { ViewrepostajeComponent } from './Modules/Repostaje/viewrepostaje/viewrepostaje.component';
import { ViewunidadesComponent } from './Modules/Flotas/viewunidades/viewunidades.component';
import { ViewrutasComponent } from './Modules/Rutas/viewrutas/viewrutas.component';
import { ViewusuariosComponent } from './Modules/Usuarios/viewusuarios/viewusuarios.component';
import { ViewtiposmantenimientosComponent } from './Modules/TiposM/viewtiposmantenimientos/viewtiposmantenimientos.component';
import { TablaEstadisticasComponent } from './Modules/tabla-estadisticas/tabla-estadisticas.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    component: MainComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'registro',
    component: RegistroComponent,
    
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'listmts',
    component: ViewmantenimientosComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  {
    path: 'listreps',
    component: ViewrepostajeComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  {
    path: 'listunis',
    component: ViewunidadesComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  {
    path: 'listrutas',
    component: ViewrutasComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  {
    path: 'listusers',
    component: ViewusuariosComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  {
    path: 'listtiposmant',
    component: ViewtiposmantenimientosComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  {
    path: 'estadistica',
    component: TablaEstadisticasComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login'])
    }
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
