import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Modules/main/main.component';
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
import { RecuperacionpassComponent } from './Modules/recuperacionpass/recuperacionpass.component';
import { Tabla1Component } from './Modules/Estadisticas/tabla-1/tabla-1.component';
import { LogsComponent } from './Modules/logs/logs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    component: MainComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  { path: 'login', component: LoginComponent },
  { path: 'restablecer', component: RecuperacionpassComponent },
  {
    path: 'listmts',
    component: ViewmantenimientosComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  {
    path: 'listreps',
    component: ViewrepostajeComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  {
    path: 'listunis',
    component: ViewunidadesComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  {
    path: 'listrutas',
    component: ViewrutasComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  {
    path: 'listusers',
    component: ViewusuariosComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => {
        const userRole = localStorage.getItem('userRole');
        return userRole === 'administrativo'
          ? true
          : redirectUnauthorizedTo(['/main']);
      },
    },
  },
  {
    path: 'listtiposmant',
    component: ViewtiposmantenimientosComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  {
    path: 'estadistica',
    component: TablaEstadisticasComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  {
    path: 'tabla',
    component: Tabla1Component,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },

  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo(['/login']),
    },
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
