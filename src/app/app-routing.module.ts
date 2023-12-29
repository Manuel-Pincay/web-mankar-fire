import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Modules/main/main.component';
import { RegistroComponent } from './Modules/registro/registro.component';
import { LoginComponent } from './Modules/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MantenimientosComponent } from './Modules/Mantenimientos/mantenimientos/mantenimientos.component';
import { ViewmantenimientosComponent } from './Modules/Mantenimientos/viewmantenimientos/viewmantenimientos.component';


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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
