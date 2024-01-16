import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { UnidadesService } from '../../../Services/unidades.service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Component({
  selector: 'app-viewunidades',
  templateUrl: './viewunidades.component.html',
  styleUrl: './viewunidades.component.css'
})
export class ViewunidadesComponent implements OnInit {
  unidades: Unidades[] = [];
  detalleunidad: any;
  form: FormGroup;
  //formularioEdicion: FormGroup; 
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private unidadesService: UnidadesService,
    private router: Router
  ) {

    this.form = this.fb.group({
      placa: ['', Validators.required],
      unidad: [null, [Validators.required, Validators.min(1)]],
      year: [null, [Validators.required, Validators.min(1900)]],
      chofer: ['', Validators.required],
      color: ['', Validators.required],
      kmac: [null, [Validators.required, Validators.min(0)]],
      marca: ['', Validators.required],
      matricula: ['', Validators.required],
      modelo: ['', Validators.required],
      imagen: [''],
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

    this.unidadesService.getUnidades().subscribe((data) => {
      this.unidades = data;
    });

  }

  verDetalles(verunidad: any) {
    console.log('tocaste', verunidad);
    this.detalleunidad = verunidad;
  }

  // ========================================================================================== //
  // Función para confirmar la eliminación de un mantenimiento
  // ========================================================================================== //
  confirmarEliminar(unidad: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que deseas eliminar unidad?'
    );
    if (confirmacion) {
      this.eliminarunidad(unidad);
    }
  }
  eliminarunidad(unidad: any): void {
    unidad.estado = false;
    this.unidadesService.deleteUnidad(unidad)
      .then(() => this.handleSuccess('Eliminado correctamente', 'success', unidad))
      .catch(error => this.handleError('Error al eliminar mantenimiento', 'error'));
  }
  // ========================================================================================== //
  // Función de alertas
  // ========================================================================================== // 


  private handleSuccess(title: string, icon: SweetAlertIcon, dato: any): void {
    console.log(title, dato);
    this.showToast(title, icon);
  }

  private handleError(title: string, icon: SweetAlertIcon): void {
    console.error(title);
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
  // Función para GUARDAR TIPOS MANTENIMIENTO
  // ========================================================================================== // 
  fileRef: string = "";
  downloadURL = "";

  onFileSelected($event: any) {
    const file = $event.target.files[0];
    const filePath = `unidades/${Date.now()}`;

    const fileRef = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef, file)
      .then(response => {
        console.log(`Subido: ${response}`);
        getDownloadURL(storageRef).then((url) => {
          this.downloadURL = url;
          console.log('URL de descarga:', this.downloadURL);
        });
      })
      .catch(error => console.log(error));
  }

  onSubmit() {
    if (this.form.valid) {
      const unidadData = this.form.value;
      const newunidad: Unidades = {
        ...unidadData,
        imagen: this.downloadURL,
      };
      console.log('Mantenimiento a enviar:', newunidad);
      this.unidadesService
        .addUnidad(newunidad)
        .then(() => {
          this.handleSuccess('Creado correctamente', 'success', newunidad);
          this.cerrarModal2(); // Llama a la función para cerrar el modal
          this.form.reset();
        })
        .catch((error) => this.handleError('Error al crear unidad', error));
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
