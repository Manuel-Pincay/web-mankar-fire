import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Repostajes from 'src/app/Interfaces/repostajes.interfaces';
import { RepostajesService } from 'src/app/Services/repostajes.service';

@Component({
  selector: 'app-viewrepostaje',
  templateUrl: './viewrepostaje.component.html',
  styleUrl: './viewrepostaje.component.css'
})
export class ViewrepostajeComponent {
  repostajes: Repostajes[] = [];
  detallerepostaje: any;
  //form: FormGroup;
  //formularioEdicion: FormGroup; 
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;



  constructor(
    private router: Router,
    private repostajesService: RepostajesService
  ) { }

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





  confirmarEliminar(repostaje: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que deseas eliminar este repostaje?'
    );
    if (confirmacion) {
      // Lógica de eliminación (puedes llamar a tu servicio para eliminar)
      this.eliminarMantenimiento(repostaje);
    }
  }

  eliminarMantenimiento(repostaje: any): void {
    // Lógica para eliminar (puedes llamar a tu servicio para eliminar)
    console.log('Repostaje eliminado:', repostaje);
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

    this.repostajesService.getRepostajes().subscribe((data) => {
      this.repostajes = data;
    });

  }
  
  verDetalles(verrepostaje: any) {
    console.log('tocaste', verrepostaje);
    this.detallerepostaje = verrepostaje;
  }
  cerrarModal() {
    // Cierra el modal usando el botón "Cerrar"
    this.cerrarModalBtn2.nativeElement.click();
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
