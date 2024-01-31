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
  mantenimientos2: Mantenimientos[] = [];
  unidades$: Observable<Unidades[]> = of([]);
  tiposM$: Observable<ListatiposM[]> = of([]);
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  detalleMantenimiento: any;
  loadingImagen: boolean = false;
  loadingImagen2: boolean = false;
  private choferPredefinido: any;
  tiposM: ListatiposM[] = [];
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
      placa: ['', Validators.required],
      comentario: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      imagen: [''],
      imagen2: [''],
      estado: [true, Validators.required],
    });
    this.formularioEdicion = this.fb.group({
      chofer: ['',Validators.required],
      placa: ['', Validators.required],
      descripcion: ['', Validators.required],
      kilometraje: [null, Validators.required],
      fecha: [new Date(), Validators.required],
      comentario: ['', Validators.required],
      imagen: [''],
      imagen2: [''],
      estado: [true, Validators.required],
    });
  }

  ngOnInit(): void {
  

    this.unidades$ = this.unidadesService.getUnidades();
    this.tiposM$ = this.tiposMService.getTiposM();

    this.mantenimientosService.getMantenimientos().subscribe((data) => {
      this.mantenimientos = data;
      this.establecerValoresPreseleccionados();
    });
    this.mantenimientosService.getMantenimientosDel().subscribe((data) => {
      this.mantenimientos2 = data;
      this.establecerValoresPreseleccionados();
    });
    if (this.editarMantenimiento2 && this.editarMantenimiento2.placa) {
      const placaValue = this.editarMantenimiento2.placa;

      this.unidadesService.getUnidad(placaValue).subscribe(
        (unidad: { chofer: any; }) => {
          if (unidad) {
            this.choferPredefinido = unidad.chofer;
          }
        },
        (error: any) => {
          console.error('Error obteniendo unidad:', error);
        }
      );
    }
    this.tiposM$.subscribe((tiposM: ListatiposM[]) => {
      this.tiposM = tiposM;
      this.establecerValoresPreseleccionados();
    });
  }
  establecerValoresPreseleccionados(): void {
    const tipoMPreseleccionado = 'Mantenimiento 2';
    this.tiposM$.subscribe((tiposM: ListatiposM[]) => {
      const tipoMSeleccionado = tiposM.find(
        (tipoM) => tipoM.nombre === tipoMPreseleccionado
      );
      if (tipoMSeleccionado) {
        this.formularioEdicion.patchValue({
          descripcion: tipoMSeleccionado.nombre,
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
      chofer: mantenimiento?.chofer || '',
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
    if (window.confirm('¿Seguro que desea eliminar este mantenimiento?')) {
      this.cambiarEstadoMantenimiento(mantenimiento);
    }
  }

  confirmarEliminar2(mantenimiento: any): void {
    const confirmacion = window.confirm('¿Seguro que desea eliminar definitivamente este repostaje?');
    if (confirmacion) {
      this.mantenimientosService
      .eliminarMantenimiento(mantenimiento)
      .then(() =>
        this.handleSuccess('Eliminado correctamente', 'success', mantenimiento)
      )
      .catch((error) =>
        this.handleError('Error al eliminar repostaje', 'error')
      );
    }
  }
 


  confirmarRecuperar(mantenimiento: any): void {
    if (window.confirm('¿Seguro que desea recuperar este mantenimiento?')) {
      this.recuperarEstadoMantenimiento(mantenimiento);
    }
  }

  recuperarEstadoMantenimiento(mantenimiento: any): void {
    mantenimiento.estado = true;

    this.mantenimientosService
      .resetMantenimiento(mantenimiento)
      .then(() =>
        this.handleSuccess('Recuperado correctamente', 'success', mantenimiento)
      )
      .catch((error) =>
        this.handleError('Error al recuperar mantenimiento', 'error')
      );
  }

  cambiarEstadoMantenimiento(mantenimiento: any): void {
    mantenimiento.estado = false;

    this.mantenimientosService
      .deleteMantenimiento(mantenimiento)
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
      timer: 2000,
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
    this.loadingImagen = true;
    const file = $event.target.files[0];
    const filePath = `mantenimientosfiles/${Date.now()}`;
    const fileRef = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef, file)
      .then(() => {
        setTimeout(() => {
          getDownloadURL(storageRef).then((url) => {
            this.downloadURL = url;
            console.log('URL:', this.downloadURL);
            this.loadingImagen = false;
          });
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        this.loadingImagen = false;
      });
  }
  
  

  fileRef2: string = '';
  downloadURL2 = '';

  onFileSelected2($event: any) {
    this.loadingImagen2 = true;
    const file2 = $event.target.files[0];
    const filePath = `mantenimientosfiles/${Date.now()}`;
    const fileRef2 = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
  
    uploadBytes(fileRef2, file2)
      .then(() => {
        setTimeout(() => {
          getDownloadURL(storageRef).then((url) => {
            this.downloadURL2 = url;
            this.loadingImagen2 = false; 
          });
        }, 500);
      })
      .catch((error) => {console.log(error); this.loadingImagen2 = false; });
  }
  
 
  onSubmit() {
    if (this.form.valid) {
      if(!this.loadingImagen && !this.loadingImagen2){
      const placaControl = this.form.get('placa');

      if (placaControl && placaControl.value !== null && placaControl.value !== undefined) {
        const placaValue = placaControl.value;
      
        this.unidadesService.getUnidad(placaValue).subscribe(
          (unidad: { chofer: any, kmac: number }) => {
            if (unidad) {
              const mantenimientoData = this.form.value;

              const tipoMSeleccionado = this.tiposM.find(
                (tipoM) => tipoM.nombre === mantenimientoData.descripcion
              );
    
              const tipoMKilometraje = tipoMSeleccionado ? tipoMSeleccionado.prox : 0;
              const proximoCambio = mantenimientoData.kilometraje + tipoMKilometraje;



              
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
                proxcambio: proximoCambio,
              };
              this.mantenimientosService
                .addMantenimiento(mantenimiento)
                .then(() => {
                  this.handleSuccess(
                    'Agregado correctamente',
                    'success',
                    mantenimiento
                  );
                  this.cerrarModal2();
                })
                .catch((error) =>
                  this.handleError(
                    'Error al agregar mantenimiento',
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
      } 
      else {
      }
    } else{
      this.showIncompleteDataAlert2();
    }
    } else {
      console.log('Datos incompletos o inválidos:', this.form.value);
      this.showIncompleteDataAlert();
    }
  }
  

  cerrarModal2() {
    this.cerrarModalBtn2.nativeElement.click();
    setTimeout(() => {
      location.reload();
    }, 2100);
  }
  private showIncompleteDataAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
    console.log()
  }

  private showIncompleteDataAlert2() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, espere a que se suba la imagen.',
    });
    console.log()
  }
  
  // ========================================================================================== //
  // ========================================================================================== //
  // ========================================================================================== //

  guardarEdicion() {
    if (this.formularioEdicion.valid) {
      if(!this.loadingImagen && !this.loadingImagen2){
      const mantenimientoedData = this.formularioEdicion.value;

      const tipoMSeleccionado = this.tiposM.find(
        (tipoM) => tipoM.nombre === mantenimientoedData.descripcion
      );

      const tipoMKilometraje = tipoMSeleccionado ? tipoMSeleccionado.prox : 0;
      const proximoCambio = mantenimientoedData.kilometraje + tipoMKilometraje;

      const fechaFormulario = mantenimientoedData.fecha;
      const fechaFormularioDate =
        fechaFormulario instanceof Date
          ? fechaFormulario
          : new Date(fechaFormulario);
      const fecha = Timestamp.fromDate(fechaFormularioDate);
      const imagen = this.downloadURL
        ? this.downloadURL
        : this.editarMantenimiento2.imagen;
      const imagen2 =
        this.downloadURL2 !== undefined && this.downloadURL2 !== null
          ? this.downloadURL2
          : this.editarMantenimiento2.imagen2;
  
      let chofer;
      if (
        this.choferPredefinido !== undefined &&
        mantenimientoedData.hasOwnProperty('chofer')
      ) {
        chofer = this.choferPredefinido;
      } else {
        chofer =
          mantenimientoedData.hasOwnProperty('chofer') &&
          mantenimientoedData.chofer !== undefined
            ? mantenimientoedData.chofer
            : null;
      }
  
      const mantenimientoed: Mantenimientos = {
        ...mantenimientoedData,
        fecha: fecha,
        imagen: imagen,
        imagen2: imagen2,
        key: this.editarMantenimiento2.key,
        chofer: chofer,
        proxcambio: proximoCambio,
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
        this.showIncompleteDataAlert2();
      }
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
 
}
