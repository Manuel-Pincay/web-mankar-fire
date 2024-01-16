import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Rutas from 'src/app/Interfaces/rutas.interfaces';
import { RutasService } from '../../../Services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewrutas',
  templateUrl: './viewrutas.component.html',
  styleUrl: './viewrutas.component.css'
})
export class ViewrutasComponent implements OnInit{
  rutas: Rutas[] = [];
  detalleruta: any;
  form: FormGroup;
  //formularioEdicion: FormGroup; 
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private RutasService: RutasService,
     ){
      this.form = this.fb.group({
        id: [null, Validators.required],
        nombre: ['', Validators.required],
        salida: ['', Validators.required],
        llegada: ['', Validators.required],
        npeajes: [null, Validators.required],
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
    
    this.RutasService.getRutas().subscribe((data) => {
      this.rutas = data;
    })
  }

  verDetalles(verruta: any) {
    console.log('tocaste', verruta);
    this.detalleruta = verruta;
  }

  


  onSubmit() {
    if (this.form.valid) {
      const rutaData = this.form.value;

      // Llama al servicio para agregar la ruta
      this.RutasService
      .guardarRuta(rutaData.salida, rutaData.llegada, rutaData.npeajes)
        .then(() => {
          // Acciones después de agregar la ruta (puede ser mostrar un mensaje, cerrar el modal, etc.)
          this.cerrarModal(); // Llama a la función para cerrar el modal
          this.form.reset();
        })
        .catch((error) => {
          // Manejar el error si es necesario
          console.error('Error al agregar ruta:', error);
        });
    } else {
      // Muestra una alerta si el formulario no es válido
      // Puedes usar tu lógica específica para mostrar mensajes de validación
    }
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
