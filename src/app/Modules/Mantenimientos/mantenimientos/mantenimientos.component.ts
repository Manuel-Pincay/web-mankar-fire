import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MantenimientosService } from '../../../Services/mantenimientos.service';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { Timestamp } from 'firebase/firestore';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { Observable, of } from 'rxjs';
import { UnidadesService } from 'src/app/Services/unidades.service';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css'],
})
export class MantenimientosComponent implements OnInit{
  form: FormGroup;
  unidades$: Observable<Unidades[]> = of([]);
  tiposM$: Observable<ListatiposM[]> = of([]);




  constructor(
    private fb: FormBuilder,
    private mantenimientosService: MantenimientosService,
    private unidadesService: UnidadesService,
    private tiposMService: TiposMService
  ) {
    this.form = this.fb.group({
      kilometraje: [null, Validators.required],
      proxcambio: [null, Validators.required],
      placa: ['', Validators.required],
      comentario: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: [new Date(), Validators.required], // inicializa la fecha con un objeto Date por defecto
      imagen: [''],
      imagen2: [''],
      estado: [true, Validators.required],
    });
  }
  ngOnInit(): void {
    this.unidades$ = this.unidadesService.getUnidades();
    this.tiposM$ = this.tiposMService.getTiposM();
  }


/*   onSubmit() {
    if (this.form.valid) {
      const mantenimientoData = this.form.value;

      const fecha =
        mantenimientoData.fecha instanceof Date
          ? mantenimientoData.fecha
          : new Date();
      const fechaTimestamp = Timestamp.fromDate(fecha);

      const mantenimiento: Mantenimientos = {
        ...mantenimientoData,
        fecha: fechaTimestamp,
      };

      console.log('Mantenimiento a enviar:', mantenimiento);
      this.mantenimientosService
        .addMantenimiento(mantenimiento)
        .then(() => this.handleSuccess())
        .catch((error) => this.handleError());
    } else {
      this.showIncompleteDataAlert();
    }
  } */
  onSubmit() {  
    if (this.form.valid) {
      // Obtén el valor actualizado de proxcambio
   /*    const proxCambio = this.calculateProxCambio();
  
      // Asigna el valor actualizado a la propiedad proxcambio en el objeto del formulario
      this.form.patchValue({ proxcambio });
   */
      // Continúa con el resto del proceso de envío
      const mantenimientoData = this.form.value;
  
      const fecha =
        mantenimientoData.fecha instanceof Date
          ? mantenimientoData.fecha
          : new Date();
      const fechaTimestamp = Timestamp.fromDate(fecha);
  
      const mantenimiento: Mantenimientos = {
        ...mantenimientoData,
        fecha: fechaTimestamp,
      };
  
      console.log('Mantenimiento a enviar:', mantenimiento);
      this.mantenimientosService
        .addMantenimiento(mantenimiento)
        .then(() => this.handleSuccess())
        .catch((error) => this.handleError());
    } else {
      this.showIncompleteDataAlert();
    }
  }

  /* private calculateProxCambio(): number {
  const selectedTipoM = this.form.get('tiposM').value;
  const tipoM = this.tiposM$.find((tipo) => tipo.id === selectedTipoM);

  if (tipoM) {
    // Devuelve la suma de kilómetros y el valor de prox del tipo de mantenimiento
    return this.form.get('kilometraje').value + tipoM.prox;
  } else {
    // Si no hay tipo de mantenimiento seleccionado, devuelve el valor actual de proxcambio
    return this.form.get('proxcambio').value;
  }
}
   */

  private handleSuccess() {
    this.showToast('success', 'Registro guardado');
  }

  private handleError() {
    this.showToast('error', 'Error en registro');
  }
  private showIncompleteDataAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }

  private showToast(icon: SweetAlertIcon, title: string) {
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
}
