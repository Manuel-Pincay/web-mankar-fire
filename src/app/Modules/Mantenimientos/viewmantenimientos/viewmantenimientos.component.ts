import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { MantenimientosService } from '../../../Services/mantenimientos.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 
@Component({
  selector: 'app-viewmantenimientos',
  templateUrl: './viewmantenimientos.component.html',
  styleUrls: ['./viewmantenimientos.component.css'],
})
export class ViewmantenimientosComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal!: ElementRef;
  mantenimientos: Mantenimientos[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private mantenimientosService: MantenimientosService
  ) {}

  ngOnInit(): void {
    this.inicializarModal();
    this.mantenimientosService.getMantenimientos().subscribe((data) => {
      this.mantenimientos = data;
    });
  }

  confirmarEliminar(mantenimiento: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que deseas eliminar este mantenimiento?'
    );
    if (confirmacion) {
      this.eliminarMantenimiento(mantenimiento);
    }
  }

  eliminarMantenimiento(mantenimiento: any): void {
    console.log('Mantenimiento eliminado:', mantenimiento);
  }

  
  private inicializarModal() {
    if (this.exampleModal) {
      this.exampleModal.nativeElement.addEventListener('show.bs.modal', (event: Event) => {
        // Código del evento omitido para brevedad
        // Puedes agregar lógica específica del modal aquí
      });
    }
  }

/*   ngAfterViewInit() {
    if (this.exampleModal) {
      this.exampleModal.nativeElement.addEventListener('show.bs.modal', (event: any) => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever');
        
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.

        // Update the modal's content.
        const modalTitle = this.exampleModal.nativeElement.querySelector('.modal-title');
        const modalBodyInput = this.exampleModal.nativeElement.querySelector('.modal-body input');

        modalTitle.textContent = `New message to ${recipient}`;
        modalBodyInput.value = recipient;
      });
    }
  } */


}