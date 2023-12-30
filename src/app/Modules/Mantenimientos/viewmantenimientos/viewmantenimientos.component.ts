import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { MantenimientosService } from '../../../Services/mantenimientos.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UnidadesService } from 'src/app/Services/unidades.service';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';
import { Timestamp } from 'firebase/firestore';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { Observable, finalize, of } from 'rxjs';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-viewmantenimientos',
  templateUrl: './viewmantenimientos.component.html',
  styleUrls: ['./viewmantenimientos.component.css'],
})
export class ViewmantenimientosComponent implements OnInit {
  
  form2: FormGroup;
  nuevoMantenimiento: any = {};
  mantenimientos: Mantenimientos[] = [];
  unidades$: Observable<Unidades[]> = of([]);
  tiposM$: Observable<ListatiposM[]> = of([]);
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  detalleMantenimiento: any; 
 
 


  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private mantenimientosService: MantenimientosService,
    private unidadesService: UnidadesService,
    private tiposMService: TiposMService, 
  ) {
    this.form2 = this.fb.group({
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
  }

  ngOnInit(): void {
    this.unidades$ = this.unidadesService.getUnidades();
    this.tiposM$ = this.tiposMService.getTiposM();
    this.mantenimientosService.getMantenimientos().subscribe((data) => {
      this.mantenimientos = data;
    });
  }


  verDetalles(mantenimiento: any) {
 
    console.log('tocaste', mantenimiento);
    this.detalleMantenimiento = mantenimiento;
   // ('#detalleModal').modal('show'); // Abre el modal
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
  
    this.mantenimientosService.updateMantenimiento(mantenimiento)
      .then(() => this.handleSuccess('Eliminado correctamente', 'success', mantenimiento))
      .catch(error => this.handleError('Error al eliminar mantenimiento', 'error' ));
  }
  
  private handleSuccess(title: string, icon: SweetAlertIcon,mantenimiento: any): void {
    console.log('Estado del mantenimiento cambiado:', mantenimiento);
    this.showToast(title,icon);
  }
  
  private handleError(title: string, icon: SweetAlertIcon): void {
    console.error('Error al cambiar el estado del mantenimiento:');
    this.showToast(title,icon);
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
      }
    });
  
    Toast.fire({ icon, title });
  }
  
  // ========================================================================================== //    
  
  fileRef: string ="";
  downloadURL="";
  
  onFileSelected($event: any) {
    const file = $event.target.files[0];
    const filePath = `mantenimientosfiles/${Date.now()}`;
 
    const fileRef = ref(this.storage,  filePath );
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef, file)
    .then(response => {
      console.log(`Subido: ${response}`);
      getDownloadURL(storageRef).then((url) => {
      this.downloadURL = url;
      console.log('URL de descarga:1111', this.downloadURL);
    });
      
    })
    .catch(error => console.log(error));
  }

  fileRef2: string ="";
  downloadURL2="";
  
  onFileSelected2($event: any) {
    const file2 = $event.target.files[0];
    const filePath = `mantenimientosfiles/${Date.now()}`;

    const fileRef2 = ref(this.storage,  filePath );
    const storageRef = ref(this.storage, filePath);
    uploadBytes(fileRef2, file2)
    .then(response => {
      console.log(`Subido: ${response}`);
      getDownloadURL(storageRef).then((url) => {
      this.downloadURL2 = url;
      console.log('URL de descarga:2222', this.downloadURL2);
    });
      
    })
    .catch(error => console.log(error));
  }

  onSubmit() {
    if (this.form2.valid) {
      const mantenimientoData = this.form2.value;

      const fecha =
        mantenimientoData.fecha instanceof Date
          ? mantenimientoData.fecha
          : new Date();
      const fechaTimestamp = Timestamp.fromDate(fecha);

      const mantenimiento: Mantenimientos = {
        ...mantenimientoData,
        fecha: fechaTimestamp,
        imagen: this.downloadURL,
        imagen2: this.downloadURL2,
      };

      console.log('Mantenimiento a enviar:', mantenimiento);
      this.mantenimientosService
        .addMantenimiento(mantenimiento)
        .then(() => this.handleSuccess('Eliminado correctamente', 'success', mantenimiento))
        .catch(error => this.handleError('Error al eliminar mantenimiento', 'error' ));
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




}