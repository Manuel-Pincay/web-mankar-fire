import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Rutas from 'src/app/Interfaces/rutas.interfaces';
import { RutasService } from '../../../Services/rutas.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-viewrutas',
  templateUrl: './viewrutas.component.html',
  styleUrl: './viewrutas.component.css'
})
export class ViewrutasComponent implements OnInit{
  rutas: Rutas[] = [];
  detalleruta: any;
  form: FormGroup;
  formularioEdicion: FormGroup; 
  rutas$: Observable<Rutas[]> = of([]);
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  editarrutaF: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private RutasService: RutasService,
     ){
      this.form = this.fb.group({
        id: [null],
        nombre: [''],
        salida: ['', Validators.required],
        llegada: ['', Validators.required],
        npeajes: [null, [Validators.required, Validators.min(0)]],
        estado: [true, Validators.required],
      });
      this.formularioEdicion = this.fb.group({
        nombre: [''],
        salida: ['', Validators.required],
        llegada: ['', Validators.required],
        npeajes: [null, [Validators.required, Validators.min(0)]],
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
    
    this.RutasService.getRutas().subscribe((data) => {
      this.rutas = data;
    })
  }

  verDetalles(verruta: any) {
    console.log('tocaste', verruta);
    this.detalleruta = verruta;
  }



  // ========================================================================================== //
  // Función para confirmar la eliminación de un mantenimiento
  // ========================================================================================== // 

  confirmarEliminar(rutas: any): void {
    if (window.confirm('¿Seguro que deseas eliminar esta ruta?')) {
      this.cambiarEstadoRutas(rutas);
    }
  }
  cambiarEstadoRutas(rutas: any): void {
    rutas.estado = false;

    this.RutasService.updateRuta(rutas)
      .then(() => this.handleSuccess('Eliminada correctamente', 'success', rutas))
      .catch(error => this.handleError('Error al eliminar ruta', 'error'));
  }

  private handleSuccess(title: string, icon: SweetAlertIcon, rutas: any): void {
    console.log('Estado de la ruta cambiado:', rutas);
    this.showToast(title, icon);
  }

  private handleError(title: string, icon: SweetAlertIcon): void {
    console.error('Error al cambiar el estado de la ruta:');
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


  onSubmit() {
    if (this.form.valid) {
      const rutaData = this.form.value;

     
      this.RutasService
      .guardarRuta(rutaData)
        .then(() => {
          this.handleSuccess('Guardado correctamente', 'success', rutaData);
          this.cerrarModal2(); // Llama a la función para cerrar el modal
          this.form.reset();
        })
        .catch((error) => this.handleError('Error al eliminar ruta', 'error'));
    } else {
      this.showIncompleteDataAlert();
    }
  }
  
  private showIncompleteDataAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }

  cerrarModal2() {
    // Cierra el modal usando el botón "Cerrar"
    this.cerrarModalBtn2.nativeElement.click();
  }




// ========================================================================================== // 
  // ========================================================================================== // 

  
  establecerValoresPreseleccionados(): void {
    const RutaPreseleccionado = 'repostaje 2';
    this.rutas$.subscribe((rutas: Rutas[]) => {
      const rutaseleccionado = rutas.find(
        (rutas) => rutas.nombre === RutaPreseleccionado
      );
      if (rutaseleccionado) {
        this.formularioEdicion.patchValue({
          rutas: rutaseleccionado.nombre,
        });
      }
    });
  }
  
  editarRutas(ruta: any) {
    console.log('tocaste edit', ruta);
    this.editarrutaF = ruta;
    this.formularioEdicion.patchValue({
      nombre: ruta?.nombre || '',
      salida: ruta?.salida || '',
      llegada: ruta?.llegada || '',
      npeajes: ruta?.npeajes || 0,

    });
    
    console.log("ASKDAJS213123123DJASDK", this.formularioEdicion);
  }
  
  guardarEdicionRuta() {
    if (this.formularioEdicion.valid) {
      const rutaEditadaData = this.formularioEdicion.value;
      console.log("ggt56", this.editarrutaF.key);
      const rutaEditado: Rutas = {
        ...rutaEditadaData,
        estado: this.editarrutaF.estado,
        id: this.editarrutaF.id,
      };
      this.RutasService
        .updateRuta(rutaEditado)
        .then(() => {
          this.handleSuccess('Edición exitosa', 'success', rutaEditado);
          this.cerrarModal(); 
        })
        .catch((error) =>
          this.handleError('Error al editar unidad', 'error')
        );
    } else {
      this.showIncompleteDataAlert();
    }
  }
  

  cerrarModal () {
    this.cerrarModalBtn2.nativeElement.click();
  }
  private showIncompleteDataAlertUnidad() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
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
