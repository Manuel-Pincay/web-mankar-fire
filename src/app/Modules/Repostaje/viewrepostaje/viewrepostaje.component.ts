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
  repostajes2: Repostajes[] = [];
  detallerepostaje: any;
  form: FormGroup;
  unidades$: Observable<Unidades[]> = of([]);
  rutas$: Observable<Rutas[]> = of([]);
  formularioEdicion: FormGroup;
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  editarrepostajeF: any;
  loadingImagen: boolean = false;

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

    this.unidades$ = this.unidadesService.getUnidades();
    this.rutas$ = this.rutasService.getRutas();

    this.repostajesService.getRepostajes().subscribe((data) => {
      this.repostajes = data;
    });
    this.repostajesService.getRepostajesDel().subscribe((data) => {
      this.repostajes2 = data;
    });
  }

  verDetalles(verrepostaje: any) {
    console.log('tocaste', verrepostaje);
    this.detallerepostaje = verrepostaje;
  }

  // ========================================================================================== //
  // Función para confirmar la eliminación de un repostaje
  // ========================================================================================== //
  confirmarEliminar(repostaje: any): void {
    const confirmacion = window.confirm('¿Seguro que desea eliminar este repostaje?');
    if (confirmacion) {
      this.eliminarrepostaje(repostaje);
    }
  }
  eliminarrepostaje(repostaje: any): void {
    repostaje.estado = false;
    this.repostajesService
      .deleteRepostaje(repostaje)
      .then(() =>
        this.handleSuccess('Eliminado correctamente', 'success', repostaje)
      )
      .catch((error) =>
        this.handleError('Error al eliminar repostaje', 'error')
      );
  }


  confirmarEliminar2(repostaje: any): void {
    const confirmacion = window.confirm('¿Seguro que desea eliminar definitivamente este repostaje?');
    if (confirmacion) {
      this.repostajesService
      .eliminarRepostaje(repostaje)
      .then(() =>
        this.handleSuccess('Eliminado correctamente', 'success', repostaje)
      )
      .catch((error) =>
        this.handleError('Error al eliminar repostaje', 'error')
      );
    }
  }
 

  confirmarRecuperar(repostaje: any): void {
    const confirmacion = window.confirm('¿Seguro que desea recuperar este repostaje?');
    if (confirmacion) {
      this.recuperarunidad(repostaje);
    }
  }
  recuperarunidad(repostaje: any): void {
    repostaje.estado = true;
    this.repostajesService
      .resetRepostaje(repostaje)
      .then(() =>
        this.handleSuccess('Recuperado correctamente', 'success', repostaje)
      )
      .catch((error) =>
        this.handleError('Error al recuperar repostaje', 'error')
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
  // Función para GUARDAR REPOSTAJE
  // ========================================================================================== //
  fileRef: string = '';
  downloadURL = '';

  onFileSelected($event: any) {
    this.loadingImagen = true;
    const file = $event.target.files[0];
    const filePath = `combustiblefiles/${Date.now()}`;
    const fileRef = ref(this.storage, filePath);
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef, file)
      .then((response) => {
        setTimeout(() => {
        getDownloadURL(storageRef).then((url) => {
          this.downloadURL = url;
          console.log('URL de descarga:', this.downloadURL);
          this.loadingImagen = false;
        });
      }, 500);
      })
      .catch((error) => {
        console.log(error);
        this.loadingImagen = false;
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

  onSubmit() {
    if (this.form.valid) {
      if(!this.loadingImagen){
      const repostajeData = this.form.value;
      const placaControl = this.form.get('placa');
      if (placaControl && placaControl.value !== null && placaControl.value !== undefined) {
        const placaValue = placaControl.value;

      
        this.unidadesService.getUnidad(placaValue).subscribe(
          (unidad: { chofer: any, kmac: number }) => {
            if (unidad) {

      const proximoKM = repostajeData.kilometraje;

      const unidadKilometraje = unidad.kmac;


      if (proximoKM > unidadKilometraje) {
        this.unidadesService.actualizarKilometrajeUnidad(placaValue, proximoKM).subscribe(
          () => {
            console.log('Kilometraje de la unidad actualizado correctamente.');
          },
          (error: any) => {
            console.error('Error actualizando el kilometraje de la unidad:', error);
          }
        );
      }

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
          this.cerrarModal2(); 
        })
        .catch((error) => this.handleError('Error al crear repostaje', error));
    }
          },
          (error: any) => {
            console.error('Error obteniendo unidad:', error);
          }
        );
      }
    } else {
      this.showIncompleteDataAlert2();
    }
  } else {
    this.showIncompleteDataAlert();
  }
}

  private showIncompleteDataAlert2() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, espere a que se suba la imagen.',
    });
    console.log()
  }

  cerrarModal () {
    this.cerrarModalBtn.nativeElement.click();
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
      if (!this.loadingImagen) {
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
  
        // Obtener la unidad y suscribirse
        this.unidadesService.getUnidad(repostajeEditado.placa).subscribe(
          (unidad: { chofer: any, kmac: number }) => {
            if (unidad) {
              const proximoKM = repostajeEditado.kilometraje;
              const unidadKilometraje = unidad.kmac;
  
              if (proximoKM > unidadKilometraje) {
                this.unidadesService.actualizarKilometrajeUnidad(repostajeEditado.placa, proximoKM).subscribe(
                  () => {
                    console.log('Kilometraje de la unidad actualizado correctamente.');
                  },
                  (error: any) => {
                    console.error('Error actualizando el kilometraje de la unidad:', error);
                  }
                );
              }
  
              // Continuar con la actualización del repostaje
              this.repostajesService.updateRepostaje(repostajeEditado).then(() => {
                this.handleSuccess('Edición exitosa', 'success', repostajeEditado);
                this.cerrarModal();
              }).catch((error) => {
                this.handleError('Error al editar repostaje', 'error');
              });
            }
          },
          (error: any) => {
            console.error('Error obteniendo unidad:', error);
          }
        );
      } else {
        this.showIncompleteDataAlert2();
      }
    } else {
      console.log('Datos incompletos o inválidos:', this.formularioEdicion.value);
      this.showIncompleteDataAlert();
    }
  }
  


    cerrarModal2() {
      this.cerrarModalBtn2.nativeElement.click();
      setTimeout(() => {
        location.reload();
      }, 2100);
    }
}
