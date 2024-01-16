import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-viewtiposmantenimientos',
  templateUrl: './viewtiposmantenimientos.component.html',
  styleUrl: './viewtiposmantenimientos.component.css'
})
export class ViewtiposmantenimientosComponent implements OnInit {

  tiposMante: ListatiposM[] = [];
  detalletiposM: any;
  form2: FormGroup;
  formularioEdicion: FormGroup;
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;




  constructor(
    private fb: FormBuilder,
    private tiposmanteService: TiposMService,
    private router: Router) {
    this.form2 = this.fb.group({
      nombre: ['', Validators.required],
      prox: [null, Validators.required],
      estado: [true, Validators.required],
    });

    this.formularioEdicion = this.fb.group({
      nombre: ['', Validators.required],
      prox: [null, Validators.required],
      estado: [true, Validators.required],
    });






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
 


    this.tiposmanteService.getTiposM().subscribe((data) => {
      this.tiposMante = data;
    })

  }


  verDetalles(tiposM: any) {
    console.log('tocaste', tiposM);
    this.detalletiposM = tiposM;
  }

  // ========================================================================================== //
  // Función para GUARDAR TIPOS MANTENIMIENTO
  // ========================================================================================== // 
  onSubmit() {
    if (this.form2.valid) {
      const tiposmantenimientoData = this.form2.value;
  
      this.tiposmanteService
        .addTipoM(tiposmantenimientoData)
        .then(() => {
          this.handleSuccess('Eliminado correctamente', 'success', tiposmantenimientoData);
          this.cerrarModal2(); // Llama a la función para cerrar el modal
          this.form2.reset();
        })
        .catch((error) => this.handleError('Error al eliminar mantenimiento', 'error'));
    } else {
      this.showIncompleteDataAlert();
    }
  }

  cerrarModal2() {
    this.cerrarModalBtn2.nativeElement.click();
  }
  private showIncompleteDataAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }


  // ========================================================================================== // 
  // ========================================================================================== // 
 


  // ========================================================================================== //
  // Función para confirmar la eliminación de un mantenimiento
  // ========================================================================================== // 

  confirmarEliminar(tiposM: any): void {
    if (window.confirm('¿Seguro que deseas eliminar este mantenimiento?')) {
      this.cambiarEstadoTiposM(tiposM);
    }
  }
  cambiarEstadoTiposM(tiposM: any): void {
    tiposM.estado = false;

    this.tiposmanteService.updateTipoM(tiposM)
      .then(() => this.handleSuccess('Eliminado correctamente', 'success', tiposM))
      .catch(error => this.handleError('Error al eliminar mantenimiento', 'error'));
  }

  private handleSuccess(title: string, icon: SweetAlertIcon, tiposM: any): void {
    console.log('Estado del tipo mantenimiento cambiado:', tiposM);
    this.showToast(title, icon);
  }

  private handleError(title: string, icon: SweetAlertIcon): void {
    console.error('Error al cambiar el estado del tipo mantenimiento:');
    this.showToast(title, icon);
  }

  private showToast(title: string, icon: SweetAlertIcon): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({ icon, title });
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
