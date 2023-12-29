import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MantenimientosService } from '../../../Services/mantenimientos.service';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, private mantenimientosService: MantenimientosService) {
    this.form = this.fb.group({
      kilometraje: [null, Validators.required],
      proxcambio: [null, Validators.required],
      placa: ['', Validators.required],
      comentario: [''],
      descripcion: [''],
      fecha: [new Date(), Validators.required], // inicializa la fecha con un objeto Date por defecto
      imagen: [''],
      imagen2: [''],
      estado: [true, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const mantenimientoData = this.form.value;

      // Asegúrate de que la propiedad fecha sea un objeto Date
      const fecha = mantenimientoData.fecha instanceof Date ? mantenimientoData.fecha : new Date();

      // Convierte la fecha a un objeto Timestamp
      const fechaTimestamp = Timestamp.fromDate(fecha);

      const mantenimiento: Mantenimientos = {
        ...mantenimientoData,
        fecha: fechaTimestamp
      };

      console.log('Mantenimiento a enviar:', mantenimiento);

      this.mantenimientosService.addMantenimiento(mantenimiento)
        .then(() => {
          console.log('Mantenimiento agregado correctamente');
        })
        .catch(error => {
          console.error('Error al agregar el mantenimiento', error);
        });
    }
  }
}