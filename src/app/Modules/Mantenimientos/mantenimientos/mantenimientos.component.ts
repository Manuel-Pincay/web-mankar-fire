import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MantenimientosService } from '../../../Services/mantenimientos.service';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { Timestamp } from 'firebase/firestore';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css'],
})
export class MantenimientosComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mantenimientosService: MantenimientosService
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

  onSubmit() {
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
  }

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
