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
          <a (click)="redireccionarMain()">
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

        <li class="sidebar-menu-item">
          <a (click)="redireccionarEst()">
            <i class="ri-line-chart-line sidebar-menu-item-icon"></i>
            Estadistica
          </a>
        </li>

        <li class="sidebar-menu-item" *ngIf="esAdmin()">
          <a (click)="redireccionarLogs()">
            <i class="ri-article-line sidebar-menu-item-icon"></i>
            Log de movimientos
          </a>
        </li>

        
        <li class="sidebar-menu-item">
          <a (click)="logoutClick()">
            <i class="ri-logout-box-line sidebar-menu-item-icon" ></i>
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
 
  constructor(private router: Router, private usuariosService: UserService,) {}
  
  esAdmin(): boolean {
    const userRole = this.usuariosService.getCurrentUser();

  return userRole === 'admin';
  }


  redireccionarMain() {
    this.router.navigate(['/main']);
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
  redireccionarLogs() {
    this.router.navigate(['/logs']);
  }
  
  ngOnInit(): void {

    // ========================================================================================== // 
    // BARRA LATERAL================================================= // 
    // ========================================================================================== // 
    const sidebarDropdownMenus = document.querySelectorAll('.sidebar-dropdown-menu');
    sidebarDropdownMenus.forEach(menu => (menu as HTMLElement).style.display = 'none');
    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a');
    sidebarMenuItems.forEach(item => item.addEventListener('click', (event) => this.sidebarItemClick(event)));
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.sidebarToggleClick.bind(this));
    }
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', this.sidebarOverlayClick.bind(this));
    }
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('collapsed');
    }
    if (window.innerWidth < 768) { }
    // ========================================================================================== // 
    // ========================================================================================== // 
 
}

logoutClick() {
  this.usuariosService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(error => console.log(error));
}

  // ========================================================================================== // 
  // ========================================================================================== // 
  // ========================================================================================== // 
  sidebarItemClick(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const parent = target.parentElement;
    if (parent && !parent.classList.contains('focused')) {
      this.hideOtherMenus(parent.parentElement);
    }
    const next = target.nextElementSibling as HTMLElement;
    if (next) {
      next.style.display = (next.style.display === 'none') ? 'block' : 'none';
    }
    if (parent) {
      parent.classList.toggle('focused');
    }
  }
  sidebarToggleClick() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      sidebar.addEventListener('mouseleave', this.sidebarMouseLeave.bind(this));
    }
  }
  sidebarOverlayClick() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('collapsed');
    }

    this.hideAllMenus();
  }
  sidebarMouseLeave() {
    this.hideAllMenus();
  }
  hideOtherMenus(element: Element | null) {
    if (element) {
      const menus = element.querySelectorAll('.sidebar-dropdown-menu');
      const hasDropdowns = element.querySelectorAll('.has-dropdown.focused');

      menus.forEach(menu => (menu as HTMLElement).style.display = 'none');
      hasDropdowns.forEach(item => item.classList.remove('focused'));
    }
  }
  hideAllMenus() {
    const menus = document.querySelectorAll('.sidebar-dropdown-menu');
    const hasDropdowns = document.querySelectorAll('.has-dropdown.focused');
    menus.forEach(menu => (menu as HTMLElement).style.display = 'none');
    hasDropdowns.forEach(item => item.classList.remove('focused'));
  }
  // ========================================================================================== // 
  // ========================================================================================== // 
  // ========================================================================================== // 


}

 