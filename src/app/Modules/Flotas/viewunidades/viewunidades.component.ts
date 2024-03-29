import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { UnidadesService } from '../../../Services/unidades.service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-viewunidades',
  templateUrl: './viewunidades.component.html',
  styleUrl: './viewunidades.component.css'
})
export class ViewunidadesComponent implements OnInit {
  unidades: Unidades[] = [];
  unidades2: Unidades[] = [];
  detalleunidad: any;
  form: FormGroup;
  formularioEdicion: FormGroup; 
  unidades$: Observable<Unidades[]> = of([]);
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  editarunidadF: any;
  loadingImagen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private unidadesService: UnidadesService,
    private router: Router
  ) {

    this.form = this.fb.group({
      placa: ['',[Validators.required, Validators.pattern('[A-Za-z]{3}\\d{3,4}')]],
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
    this.formularioEdicion = this.fb.group({
      placa: ['',[Validators.required, Validators.pattern('[A-Za-z]{3}\\d{3,4}')]],
      unidad: [null, [Validators.required, Validators.min(1)]],
      year: ['', Validators.required],
      chofer: ['', Validators.required],
      color: ['', Validators.required],
      kmac: [0, Validators.required],
      marca: ['', Validators.required],
      matricula: ['', Validators.required],
      imagen: [''],
      modelo: ['', Validators.required],
      estado: [true, Validators.required],
    });
  }
  shouldShowPlacaError(): boolean {
    const placaControl = this.form.get('placa');
    return !!placaControl && placaControl.hasError('pattern') && placaControl.touched;
  }
  
  
  ngOnInit(): void { 

    this.unidadesService.getUnidades().subscribe((data) => {
      this.unidades = data;
    });
    this.unidadesService.getUnidadesDel().subscribe((data) => {
      this.unidades2 = data;
    });

  }

  verDetalles(verunidad: any) {
    console.log('tocaste', verunidad);
    this.detalleunidad = verunidad;
  }





  // ========================================================================================== //
  // Función para confirmar la eliminación de una unidad
  // ========================================================================================== //
  confirmarEliminar(unidad: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que desea eliminar esta unidad?'
    );
    if (confirmacion) {
      this.eliminarunidad(unidad);
    }
  }


  
  confirmarEliminar2(unidad: any): void {
    const confirmacion = window.confirm('¿Seguro que desea eliminar definitivamente este repostaje?');
    if (confirmacion) {
      this.unidadesService
      .eliminarTotal(unidad)
      .then(() =>
        this.handleSuccess('Eliminado correctamente', 'success', unidad)
      )
      .catch((error) =>
        this.handleError('Error al eliminar repostaje', 'error')
      );
    }
  }
 

  eliminarunidad(unidad: any): void {
    unidad.estado = false;
    this.unidadesService.deleteUnidad(unidad)
      .then(() => this.handleSuccess('Eliminada correctamente', 'success', unidad))
      .catch(error => this.handleError('Error al eliminar la unidad', 'error'));
  }

  confirmarRecuperar(unidad: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que desea recuperar esta unidad?'
    );
    if (confirmacion) {
      this.recuperarunidad(unidad);
    }
  }
  recuperarunidad(unidad: any): void {
    unidad.estado = false;
    this.unidadesService.resetUnidad(unidad)
      .then(() => this.handleSuccess('Recuperada correctamente', 'success', unidad))
      .catch(error => this.handleError('Error al recuperar la unidad', 'error'));
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

  private showToast(title: string, icon: SweetAlertIcon,  message?: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({ icon, title, text: message });
  }
  // ========================================================================================== //
  // Función para GUARDAR TIPOS MANTENIMIENTO
  // ========================================================================================== // 
  fileRef: string = '';
  downloadURL = '';

  onFileSelected($event: any) {
    this.loadingImagen = true;
    const file = $event.target.files[0];
    const filePath = `unidades/${Date.now()}`;
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
        console.error('Error al cargar la imagen:', error);
      })
      .finally(() => {
        this.loadingImagen = false;
      });
  }
  
  

  private handlePlacaExistenteError(): void {
    const title = 'Error al agregar una unidad';
    const icon = 'error';
    const message = 'Ya existe una unidad con la misma placa';
    console.error(title);
    this.showToast(title, icon, message);
  }

  onSubmit() {
    if (this.form.valid) {
      if(!this.loadingImagen){
      const unidadData = this.form.value;
      const newunidad: Unidades = {
        ...unidadData,
        imagen: this.downloadURL,
      };
      this.unidadesService
        .addUnidad(newunidad)
        .then(() => {
          this.handleSuccess('Creada correctamente', 'success', newunidad);
          this.cerrarModal2(); 
          this.form.reset();
        })
        .catch((error:any) => {
          if (error === 'placa_existente') {
            this.handlePlacaExistenteError();
          }else {
            this.handleError('Error al crear unidad', error)
          }
        });
      } else{
        this.showIncompleteDataAlert2();
      }
      } else {
        console.log('Datos incompletos o inválidos:', this.form.value);
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
  }


  // ========================================================================================== // 
  // ========================================================================================== // 

  
  establecerValoresPreseleccionados(): void {
    const UnidadPreseleccionado = 'unidad 2';
    this.unidades$.subscribe((unidades: Unidades[]) => {
      const unidadseleccionado = unidades.find(
        (unidades) => unidades.nombre === UnidadPreseleccionado
      );
      if (unidadseleccionado) {
        this.formularioEdicion.patchValue({
          unidades: unidadseleccionado.nombre,
        });
      }
    });
  }
  
  editarUnidad(unidad: any) {
    this.editarunidadF = unidad;
    this.formularioEdicion.patchValue({
      placa: unidad?.placa || null,
      unidad: unidad?.unidad || null,
      year: unidad?.year || null,
      chofer: unidad?.chofer || '',
      color: unidad?.color || '',
      kmac: unidad?.kmac || 0,
      marca: unidad?.marca || '',
      matricula: unidad?.matricula || '',
      modelo: unidad?.modelo || '',
      imagen: unidad?.imagen || '',
    });
  }
  
  guardarEdicionUnidad() {
    if (this.formularioEdicion.valid) {
      if(!this.loadingImagen){
      const unidadEditadaData = this.formularioEdicion.value;
 
      const unidadEditado: Unidades = {
        ...unidadEditadaData,
        imagen: this.downloadURL,
      };
      this.unidadesService
        .updateUnidad(unidadEditado)
        .then(() => {
          this.handleSuccess('Edición exitosa', 'success', unidadEditado);
          this.cerrarModal(); 
        })
        .catch((error) =>
          this.handleError('Error al editar unidad', 'error')
        );
      } else {
        this.showIncompleteDataAlert2();
      }
    } else {
        this.showIncompleteDataAlert();
      }
    }
  

  cerrarModal () {
    this.cerrarModalBtn.nativeElement.click();
  }
  private showIncompleteDataAlertUnidad() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }

}
