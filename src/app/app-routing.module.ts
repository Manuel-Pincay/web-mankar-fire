import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Modules/main/main.component';
import { RegistroComponent } from './Modules/registro/registro.component';
import { LoginComponent } from './Modules/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MantenimientosComponent } from './Modules/Mantenimientos/mantenimientos/mantenimientos.component';
import { ViewmantenimientosComponent } from './Modules/Mantenimientos/viewmantenimientos/viewmantenimientos.component';
import { ViewrepostajeComponent } from './Modules/Repostaje/viewrepostaje/viewrepostaje.component';
import { ViewunidadesComponent } from './Modules/Flotas/viewunidades/viewunidades.component';
import { ViewrutasComponent } from './Modules/Rutas/viewrutas/viewrutas.component';
import { ViewusuariosComponent } from './Modules/Usuarios/viewusuarios/viewusuarios.component';
import { ViewtiposmantenimientosComponent } from './Modules/TiposM/viewtiposmantenimientos/viewtiposmantenimientos.component';


const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    component: MainComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'mantenimientos', component: MantenimientosComponent },
  { path: 'listmts', component: ViewmantenimientosComponent },
  { path: 'listreps', component: ViewrepostajeComponent },
  { path: 'listunis', component: ViewunidadesComponent },
  { path: 'listrutas', component: ViewrutasComponent},
  { path: 'listusers', component: ViewusuariosComponent},
  { path: 'listtiposmant', component: ViewtiposmantenimientosComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
