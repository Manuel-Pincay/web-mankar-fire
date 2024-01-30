import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-viewtiposmantenimientos',
  templateUrl: './viewtiposmantenimientos.component.html',
  styleUrl: './viewtiposmantenimientos.component.css'
})
export class ViewtiposmantenimientosComponent implements OnInit {

  tiposMante: ListatiposM[] = [];
  tiposMante2: ListatiposM[] = [];
  detalletiposM: any;
  form: FormGroup;
  formularioEdicion: FormGroup; 
  listatiposM$: Observable<ListatiposM[]> = of([]);
  @ViewChild('cerrarModalBtnMantenimiento') cerrarModalBtnMantenimiento!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  editarlistatiposMF: any;

  constructor(
    private fb: FormBuilder,
    private tiposmanteService: TiposMService,
    private router: Router) {
    this.form = this.fb.group({
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


  ngOnInit(): void {

    this.tiposmanteService.getTiposM().subscribe((data) => {
      this.tiposMante = data;
    })
    this.tiposmanteService.getTiposMDel().subscribe((data) => {
      this.tiposMante2 = data;
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
    if (this.form.valid) {
      const tiposmantenimientoData = this.form.value;
      const newretiposm: ListatiposM = {
        ...tiposmantenimientoData,
      };
      this.tiposmanteService
        .addTipoM(newretiposm)
        .then(() => {
          this.handleSuccess('Eliminado correctamente', 'success', newretiposm);
          this.cerrarModal2();
          this.form.reset();
        })
        .catch((error) => this.handleError('Error al eliminar el tipo de mantenimiento', 'error'));
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
    if (window.confirm('¿Seguro que desea eliminar este tipo de mantenimiento?')) {
      this.cambiarEstadoTiposM(tiposM);
    }
  }
  cambiarEstadoTiposM(tiposM: any): void {
    tiposM.estado = false;

    this.tiposmanteService.deleteTipoM(tiposM)
      .then(() => this.handleSuccess('Eliminado correctamente', 'success', tiposM))
      .catch(error => this.handleError('Error al eliminar el tipo de mantenimiento', 'error'));
  }

  confirmarRecuperar(tiposM: any): void {
    if (window.confirm('¿Seguro que desea recuperar este tipo de mantenimiento?')) {
      this.RecuperarTiposM(tiposM);
    }
  }
  RecuperarTiposM(tiposM: any): void {
    tiposM.estado = true;
    this.tiposmanteService.resetTipoM(tiposM)
      .then(() => this.handleSuccess('Recuperado correctamente', 'success', tiposM))
      .catch(error => this.handleError('Error al recuperar el tipo de mantenimiento', 'error'));
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
  

  establecerValoresPreseleccionados(): void {
    const ListatiposMPreseleccionado = 'tiposm 2';
    this.listatiposM$.subscribe((tiposM: ListatiposM[]) => {
      const listatiposMseleccionado = tiposM.find(
        (tiposM) => tiposM.nombre === ListatiposMPreseleccionado
      );
      if (listatiposMseleccionado) {
        this.formularioEdicion.patchValue({
          tiposM: listatiposMseleccionado.nombre,
        });
      }
    });
  }
  
  editarTiposM(tiposM: any) {
    this.editarlistatiposMF = tiposM;
    this.formularioEdicion.patchValue({
      nombre: tiposM?.nombre || '',
      prox: tiposM?.prox || 0,

    });
  }
  
  guardarEdicionTiposM() {
    if (this.formularioEdicion.valid) {
      const tipoMEditadaData = this.formularioEdicion.value;
      
      const tipoMEditado: ListatiposM = {
        ...tipoMEditadaData,
        key: this.editarlistatiposMF.key,
      };
      this.tiposmanteService
        .updateTipoM(tipoMEditadaData)
        .then(() => {
          this.handleSuccess('Edición exitosa', 'success', tipoMEditadaData);
          this.cerrarModal(); 
        })
        .catch((error) =>
          this.handleError('Error al editar el tipo de mantenimiento', 'error')
        );
    } else {
      this.showIncompleteDataAlert();
    }
  }
  

  cerrarModal () {
    this.cerrarModalBtnMantenimiento.nativeElement.click();
  }
  private showIncompleteDataAlertUnidad() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }
}
