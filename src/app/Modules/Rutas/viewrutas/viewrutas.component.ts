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
  rutas2: Rutas[] = [];
  detalleruta: any;
  form: FormGroup;
  formularioEdicion: FormGroup; 
  rutas$: Observable<Rutas[]> = of([]);
  @ViewChild('cerrarModalBtnRuta') cerrarModalBtnRuta!: ElementRef;
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

  
 
  ngOnInit(): void {
    
    this.RutasService.getRutas().subscribe((data) => {
      this.rutas = data;
    })
    this.RutasService.getRutasDel().subscribe((data) => {
      this.rutas2 = data;
    })
  }

  verDetalles(verruta: any) {
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

    this.RutasService.deleteRuta(rutas)
      .then(() => this.handleSuccess('Eliminada correctamente', 'success', rutas))
      .catch(error => this.handleError('Error al eliminar ruta', 'error'));
  }

  confirmarRecuperar(rutas: any): void {
    if (window.confirm('¿Seguro que deseas recuperar esta ruta?')) {
      this.recuperarRutas(rutas);
    }
  }
  recuperarRutas(rutas: any): void {
    rutas.estado = true;
    this.RutasService.resetRuta(rutas)
      .then(() => this.handleSuccess('Recuperar correctamente', 'success', rutas))
      .catch(error => this.handleError('Error al recuperar ruta', 'error'));
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
      timer: 2000,
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
          this.cerrarModal2();
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
    this.editarrutaF = ruta;
    this.formularioEdicion.patchValue({
      nombre: ruta?.nombre || '',
      salida: ruta?.salida || '',
      llegada: ruta?.llegada || '',
      npeajes: ruta?.npeajes || 0,

    });
  }
  
  guardarEdicionRuta() {
    if (this.formularioEdicion.valid) {
      const rutaEditadaData = this.formularioEdicion.value;
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
    this.cerrarModalBtnRuta.nativeElement.click();
  }
  private showIncompleteDataAlertUnidad() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }
}
