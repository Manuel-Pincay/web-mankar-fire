import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Repostajes from 'src/app/Interfaces/repostajes.interfaces';
import { RepostajesService } from 'src/app/Services/repostajes.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { UnidadesService } from 'src/app/Services/unidades.service';
import { Timestamp } from 'firebase/firestore';
import Rutas from 'src/app/Interfaces/rutas.interfaces';
import { RutasService } from 'src/app/Services/rutas.service';

@Component({
  selector: 'app-viewrepostaje',
  templateUrl: './viewrepostaje.component.html',
  styleUrl: './viewrepostaje.component.css',
})
export class ViewrepostajeComponent {
  repostajes: Repostajes[] = [];
  detallerepostaje: any;
  form: FormGroup;
  unidades$: Observable<Unidades[]> = of([]);
  rutas$: Observable<Rutas[]> = of([]);
  formularioEdicion: FormGroup;
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  editarrepostajeF: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storage: Storage,
    private repostajesService: RepostajesService,
    private rutasService: RutasService,
    private unidadesService: UnidadesService
  ) {
    this.form = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(0)]],
      kilometraje: [null, [Validators.required, Validators.min(0)]],
      fecha: [null, Validators.required],
      estado: [true, Validators.required],
      imagen: [''],
      ruta: ['', Validators.required],
      placa: ['', Validators.required],
    });
    this.formularioEdicion = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(0)]],
      kilometraje: [null, [Validators.required, Validators.min(0)]],
      fecha: [null, Validators.required],
      estado: [true, Validators.required],
      imagen: [''],
      ruta: ['', Validators.required],
      placa: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // ========================================================================================== //
    // BARRA LATERAL================================================= //
    // ========================================================================================== //
    const sidebarDropdownMenus = document.querySelectorAll(
      '.sidebar-dropdown-menu'
    );
    sidebarDropdownMenus.forEach(
      (menu) => ((menu as HTMLElement).style.display = 'none')
    );
    const sidebarMenuItems = document.querySelectorAll(
      '.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a'
    );
    sidebarMenuItems.forEach((item) =>
      item.addEventListener('click', (event) => this.sidebarItemClick(event))
    );
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener(
        'click',
        this.sidebarToggleClick.bind(this)
      );
    }
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener(
        'click',
        this.sidebarOverlayClick.bind(this)
      );
    }
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('collapsed');
    }
    if (window.innerWidth < 768) {
    }
    // ========================================================================================== //
    // ========================================================================================== //
    this.unidades$ = this.unidadesService.getUnidades();
    this.rutas$ = this.rutasService.getRutas();

    this.repostajesService.getRepostajes().subscribe((data) => {
      this.repostajes = data;
    });
  }

  verDetalles(verrepostaje: any) {
    console.log('tocaste', verrepostaje);
    this.detallerepostaje = verrepostaje;
  }

  // ========================================================================================== //
  // Función para confirmar la eliminación de un mantenimiento
  // ========================================================================================== //
  confirmarEliminar(repostaje: any): void {
    const confirmacion = window.confirm('¿Seguro que deseas eliminar unidad?');
    if (confirmacion) {
      this.eliminarunidad(repostaje);
    }
  }
  eliminarunidad(repostaje: any): void {
    repostaje.estado = false;
    this.repostajesService
      .deleteRepostaje(repostaje)
      .then(() =>
        this.handleSuccess('Eliminado correctamente', 'success', repostaje)
      )
      .catch((error) =>
        this.handleError('Error al eliminar mantenimiento', 'error')
      );
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
      },
    });
    Toast.fire({ icon, title });
  }

  // ========================================================================================== //
  // Función para GUARDAR TIPOS MANTENIMIENTO
  // ========================================================================================== //
  fileRef: string = '';
  downloadURL = '';

  onFileSelected($event: any) {
    const file = $event.target.files[0];
    const filePath = `combustiblefiles/${Date.now()}`;

    const fileRef = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef, file)
      .then((response) => {
        console.log(`Subido: ${response}`);
        getDownloadURL(storageRef).then((url) => {
          this.downloadURL = url;
          console.log('URL de descarga:', this.downloadURL);
        });
      })
      .catch((error) => console.log(error));
  }
  formatDate(date: Date): string {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return '';
  }

  onSubmit() {
    if (this.form.valid) {
      const repostajeData = this.form.value;
      const fechaFormulario = repostajeData.fecha;
      const fechaFormularioDate =
        fechaFormulario instanceof Date
          ? fechaFormulario
          : new Date(fechaFormulario);
      const fechaTimestamp = Timestamp.fromDate(fechaFormularioDate);
      const newrepostaje: Repostajes = {
        ...repostajeData,
        fecha: fechaTimestamp,
        imagen: this.downloadURL,
      };
      this.repostajesService
        .addRepostaje(newrepostaje)
        .then(() => {
          this.handleSuccess('Creado correctamente', 'success', newrepostaje);
          this.cerrarModal(); 
          this.form.reset();
        })
        .catch((error) => this.handleError('Error al crear unidad', error));
    } else {
      this.showIncompleteDataAlert();
    }
  }

  cerrarModal () {
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
  // Función para EDITAR REPOSTAJES
  // ========================================================================================== //

  establecerValoresPreseleccionados(): void {
    const rutaPreseleccionado = 'repostaje 2';
    this.rutas$.subscribe((rutas: Rutas[]) => {
      const rutaseleccionado = rutas.find(
        (rutas) => rutas.nombre === rutaPreseleccionado
      );
      if (rutaseleccionado) {
        this.formularioEdicion.patchValue({
          ruta: rutaseleccionado.nombre,
        });
      }
    });
  }

  editarRepostaje(repostaje: any) {
    this.editarrepostajeF = repostaje;
    this.formularioEdicion.patchValue({
      cantidad: repostaje?.cantidad || null,
      kilometraje: repostaje?.kilometraje || null,
      fecha: this.formatDate(repostaje?.fecha) || null,
      imagen: repostaje?.imagen || '',
      ruta: repostaje?.ruta || '',
      placa: repostaje?.placa || '',
    });
  }

  
  guardarEdicion() {
    if (this.formularioEdicion.valid) {
      const EditrepostajeData = this.formularioEdicion.value;
      const fechaFormulario = EditrepostajeData.fecha;
      const fechaFormularioDate =
        fechaFormulario instanceof Date
          ? fechaFormulario
          : new Date(fechaFormulario);
      const fecha = Timestamp.fromDate(fechaFormularioDate);
      const imagen = this.downloadURL
        ? this.downloadURL
        : this.editarrepostajeF.imagen;
      const repostajeEditado: Repostajes = {
        ...EditrepostajeData,
        fecha: fecha,
        imagen: imagen, 
        key: this.editarrepostajeF.key,
      };
      this.repostajesService
        .updateRepostaje(repostajeEditado)
        .then(() => {
          this.handleSuccess('Edición exitosa', 'success', repostajeEditado);
          this.cerrarModal(); 
        })
        .catch((error) =>
          this.handleError('Error al editar mantenimiento', 'error')
        );
    } else {
      this.showIncompleteDataAlert();
    }
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
      next.style.display = next.style.display === 'none' ? 'block' : 'none';
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

      menus.forEach((menu) => ((menu as HTMLElement).style.display = 'none'));
      hasDropdowns.forEach((item) => item.classList.remove('focused'));
    }
  }
  hideAllMenus() {
    const menus = document.querySelectorAll('.sidebar-dropdown-menu');
    const hasDropdowns = document.querySelectorAll('.has-dropdown.focused');
    menus.forEach((menu) => ((menu as HTMLElement).style.display = 'none'));
    hasDropdowns.forEach((item) => item.classList.remove('focused'));
  }
  // ========================================================================================== //
  // ========================================================================================== //
  // ========================================================================================== //
}
