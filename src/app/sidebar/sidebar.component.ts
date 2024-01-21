import { Component } from '@angular/core';

import { Router } from '@angular/router';


import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar position-fixed top-0 bottom-0 bg-white border-end">
      <div class="d-flex align-items-center p-3">
        <a href="#" class="sidebar-logo text-uppercase fw-bold text-decoration-none text-indigo fs-4">
          MANKAR
        </a>
        <i class="sidebar-toggle ri-arrow-left-circle-line ms-auto fs-5 d-none d-md-block"></i>
      </div>
      <ul class="sidebar-menu p-3 m-0 mb-0">
        <li class="sidebar-menu-item active">
          <a href="#">
            <i class="ri-dashboard-line sidebar-menu-item-icon"></i>
            Home
          </a>
        </li>

        <li class="sidebar-menu-divider mt-3 mb-1 text-uppercase">
          Panel Administrativo
        </li>
        <li class="sidebar-menu-item">
          <a (click)="redireccionarMantenimientos()">
            <i class="ri-settings-line sidebar-menu-item-icon"></i>
            Mantenimientos
          </a>
        </li>
        <li class="sidebar-menu-item">
          <a (click)="redireccionarRepostaje()">
            <i class="ri-gas-station-line sidebar-menu-item-icon"></i>
            Repostajes
          </a>
        </li>
        <li class="sidebar-menu-item">
          <a (click)="redireccionarUnidades()">
            <i class="ri-truck-line sidebar-menu-item-icon"></i>
            Unidades
          </a>
        </li>
        <li class="sidebar-menu-item">
          <a (click)="redireccionarTiposM()">
            <i class="ri-list-settings-line sidebar-menu-item-icon"></i>Tipos de
            mantenimientos
          </a>
        </li>
        <li class="sidebar-menu-item">
          <a (click)="redireccionarRutas()">
            <i class="ri-road-map-line sidebar-menu-item-icon"></i>
            Rutas
          </a>
        </li>
        <li class="sidebar-menu-item" *ngIf="esAdmin()">
          <a (click)="redireccionarUsuarios()">
            <i class="ri-user-3-line sidebar-menu-item-icon"></i>
            Usuarios
          </a>
        </li>

        <li class="sidebar-menu-divider mt-3 mb-1 text-uppercase">Apps</li>

        <li class="sidebar-menu-item" *ngIf="esAdmin()">
          <a (click)="redireccionarEst()">
            <i class="ri-line-chart-line sidebar-menu-item-icon"></i>
            Estadistica
          </a>
        </li>

        <li class="sidebar-menu-item">
          <a href="#">
            <i class="ri-mail-line sidebar-menu-item-icon"></i>
            Email
          </a>
        </li>
        <li class="sidebar-menu-item">
          <a href="#">
            <i class="ri-logout-box-line sidebar-menu-item-icon"></i>
            Desconectarse
          </a>
        </li>
      </ul>
    </div>

    <div class="sidebar-overlay"></div>
  `,
  styleUrls: ['./sidebar.component.css'] 
})
export class SidebarComponent {
 
  constructor(private router: Router, private usuariosService: UserService) {}
  
  esAdmin(): boolean {
    const userRole = this.usuariosService.getCurrentUser();

  return userRole === 'admins';
  }

  redireccionarMantenimientos() {
    this.router.navigate(['/listmts']);
  }

  redireccionarUsuarios() {
    this.router.navigate(['/listusers']);
  }

  redireccionarUnidades() {
    this.router.navigate(['/listunis']);
  }
  redireccionarRepostaje() {
    this.router.navigate(['/listreps']);
  }
  redireccionarTiposM() {
    this.router.navigate(['/listtiposmant']);
  }
  redireccionarRutas() {
    this.router.navigate(['/listrutas']);
  }
  redireccionarEst() {
    this.router.navigate(['/estadistica']);
  }
}