import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { MantenimientosService } from '../../../Services/mantenimientos.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { UnidadesService } from 'src/app/Services/unidades.service';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';
import { Timestamp } from 'firebase/firestore';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { Observable, finalize, of } from 'rxjs';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewmantenimientos',
  templateUrl: './viewmantenimientos.component.html',
  styleUrls: ['./viewmantenimientos.component.css'],
})
export class ViewmantenimientosComponent implements OnInit {
  form: FormGroup;
  formularioEdicion: FormGroup;
  nuevoMantenimiento: any = {};
  nombreChofer: string = '';
  mantenimientos: Mantenimientos[] = [];
  unidades$: Observable<Unidades[]> = of([]);
  tiposM$: Observable<ListatiposM[]> = of([]);
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  detalleMantenimiento: any;

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private mantenimientosService: MantenimientosService,
    private unidadesService: UnidadesService,
    private tiposMService: TiposMService,
    private router: Router
  ) {
    this.form = this.fb.group({
      chofer: ['',],
      kilometraje: [null, Validators.required],
      proxcambio: [null, Validators.required],
      placa: ['', Validators.required],
      comentario: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      imagen: [''],
      imagen2: [''],
      estado: [true, Validators.required],
    });
    this.formularioEdicion = this.fb.group({
      placa: ['', Validators.required],
      chofer: ['', Validators.required],
      descripcion: ['', Validators.required],
      kilometraje: [null, Validators.required],
      proxcambio: [null, Validators.required],
      fecha: [new Date(), Validators.required],
      comentario: ['', Validators.required],
      imagen: [''],
      imagen2: [''],
      estado: [true, Validators.required],
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
    this.tiposM$ = this.tiposMService.getTiposM();

    this.mantenimientosService.getMantenimientos().subscribe((data) => {
      this.mantenimientos = data;
      this.establecerValoresPreseleccionados();
    });
  }
  establecerValoresPreseleccionados(): void {
    const tipoMPreseleccionado = 'Mantenimiento 2';

    // Suscribirse al observable para obtener los datos
    this.tiposM$.subscribe((tiposM: ListatiposM[]) => {
      // Encuentra el objeto correspondiente en tiposM por su nombre
      const tipoMSeleccionado = tiposM.find(
        (tipoM) => tipoM.nombre === tipoMPreseleccionado
      );

      // Si se encuentra, establece el valor preseleccionado en el formulario
      if (tipoMSeleccionado) {
        this.formularioEdicion.patchValue({
          descripcion: tipoMSeleccionado.nombre,
          // Otros campos...
        });
      }
    });
  }
  editarMantenimiento2: any;
  editarMantenimiento(mantenimiento: any) {
    this.editarMantenimiento2 = mantenimiento;
    this.formularioEdicion.patchValue({
      placa: mantenimiento?.placa || '',
      descripcion: mantenimiento?.descripcion || '',
      kilometraje: mantenimiento?.kilometraje || '',
      proxcambio: mantenimiento?.proxcambio || '',
      fecha: this.formatDate(mantenimiento?.fecha) || '',
      comentario: mantenimiento?.comentario || '',
      imagen: mantenimiento?.imagen || '',
      imagen2: mantenimiento?.imagen2 || '',
    });
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

  verDetalles(mantenimiento: any) {
    this.detalleMantenimiento = mantenimiento;
  }

  // ========================================================================================== //
  // Función para confirmar la eliminación de un mantenimiento
  confirmarEliminar(mantenimiento: any): void {
    if (window.confirm('¿Seguro que deseas eliminar este mantenimiento?')) {
      this.cambiarEstadoMantenimiento(mantenimiento);
    }
  }

  cambiarEstadoMantenimiento(mantenimiento: any): void {
    mantenimiento.estado = false;

    this.mantenimientosService
      .updateMantenimiento(mantenimiento)
      .then(() =>
        this.handleSuccess('Eliminado correctamente', 'success', mantenimiento)
      )
      .catch((error) =>
        this.handleError('Error al eliminar mantenimiento', 'error')
      );
  }

  private handleSuccess(
    title: string,
    icon: SweetAlertIcon,
    mantenimiento: any
  ): void {
    console.log('Estado del mantenimiento cambiado:', mantenimiento);
    this.showToast(title, icon);
  }

  private handleError(title: string, icon: SweetAlertIcon): void {
    console.error('Error al cambiar el estado del mantenimiento:');
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

  fileRef: string = '';
  downloadURL = '';

  onFileSelected($event: any) {
    const file = $event.target.files[0];
    const filePath = `mantenimientosfiles/${Date.now()}`;
    const fileRef = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef, file)
      .then((response) => {
        console.log(`Subido: ${response}`);
        getDownloadURL(storageRef).then((url) => {
          this.downloadURL = url;
          console.log('URL:', this.downloadURL);
        });
      })
      .catch((error) => console.log(error));
  }

  fileRef2: string = '';
  downloadURL2 = '';

  onFileSelected2($event: any) {
    const file2 = $event.target.files[0];
    const filePath = `mantenimientosfiles/${Date.now()}`;

    const fileRef2 = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef2, file2)
      .then((response) => {
        getDownloadURL(storageRef).then((url) => {
          this.downloadURL2 = url;
        });
      })
      .catch((error) => console.log(error));
  }
 
  onSubmit() {
    if (this.form.valid) {
      const placaControl = this.form.get('placa');
  
      if (placaControl && placaControl.value !== null && placaControl.value !== undefined) {
        const placaValue = placaControl.value;
      
        this.unidadesService.getUnidad(placaValue).subscribe(
          (unidad: { chofer: any; }) => {
            if (unidad) {
              const mantenimientoData = this.form.value;
  
              const fechaFormulario = mantenimientoData.fecha;
              const fechaFormularioDate =
                fechaFormulario instanceof Date
                  ? fechaFormulario
                  : new Date(fechaFormulario);
              const fechaTimestamp = Timestamp.fromDate(fechaFormularioDate);
              const mantenimiento: Mantenimientos = {
                ...mantenimientoData,
                fecha: fechaTimestamp,
                imagen: this.downloadURL,
                imagen2: this.downloadURL2,
                chofer: unidad.chofer,
              };
              this.mantenimientosService
                .addMantenimiento(mantenimiento)
                .then(() => {
                  this.handleSuccess(
                    'Eliminado correctamente',
                    'success',
                    mantenimiento
                  );
                  this.cerrarModal2();
                  this.form.reset();
                })
                .catch((error) =>
                  this.handleError(
                    'Error al eliminar mantenimiento',
                    'error'
                  )
                );
            } else {
            }
          },
          (error: any) => {
            console.error('Error obteniendo unidad:', error);
          }
        );
      } else {
      }
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

  guardarEdicion() {
    if (this.formularioEdicion.valid) {
      const mantenimientoedData = this.formularioEdicion.value;
      const fechaFormulario = mantenimientoedData.fecha;
      const fechaFormularioDate =
        fechaFormulario instanceof Date
          ? fechaFormulario
          : new Date(fechaFormulario);
      const fecha = Timestamp.fromDate(fechaFormularioDate);
      const imagen = this.downloadURL
        ? this.downloadURL
        : this.editarMantenimiento2.imagen;
      const imagen2 = this.downloadURL2
        ? this.downloadURL2
        : this.editarMantenimiento2.imagen2;
      const mantenimientoed: Mantenimientos = {
        ...mantenimientoedData,
        fecha: fecha,
        imagen: imagen,
        imagen2: imagen2,
        key: this.editarMantenimiento2.key,
      };
      this.mantenimientosService
        .updateMantenimiento(mantenimientoed)
        .then(() => {
          this.handleSuccess('Edición exitosa', 'success', mantenimientoed);
          this.cerrarModal(); 
        })
        .catch((error) =>
          this.handleError('Error al editar mantenimiento', 'error')
        );
    } else {
      this.showIncompleteDataAlert();
    }
  }
  cerrarModal() {
    this.cerrarModalBtn.nativeElement.click();
  }

  // ========================================================================================== //
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
