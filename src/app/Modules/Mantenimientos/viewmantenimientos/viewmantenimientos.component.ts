import { Component } from '@angular/core';
import Mantenimientos from '../../../Interfaces/mantenimientos.interfaces';
import { MantenimientosService } from '../../../Services/mantenimientos.service';

@Component({
  selector: 'app-viewmantenimientos',
  templateUrl: './viewmantenimientos.component.html',
  styleUrl: './viewmantenimientos.component.css'
})
export class ViewmantenimientosComponent {
  mantenimientos: Mantenimientos[] = [];
  
  // Inyecta el servicio en el constructor
  constructor(private mantenimientosService: MantenimientosService) {}

  ngOnInit(): void {
    // Llama al método del servicio para obtener los mantenimientos
    this.mantenimientosService.getMantenimientos().subscribe((data) => {
      this.mantenimientos = data;
    });
  }

  confirmarEliminar(mantenimiento: any): void {
    const confirmacion = window.confirm('¿Seguro que deseas eliminar este mantenimiento?');
    if (confirmacion) {
      // Lógica de eliminación (puedes llamar a tu servicio para eliminar)
      this.eliminarMantenimiento(mantenimiento);
    }
  }

  editarMantenimiento(mantenimiento: any): void {
    // Lógica para editar (puedes redirigir a una página de edición)
    // Puedes implementar esto según tus necesidades
  }

  eliminarMantenimiento(mantenimiento: any): void {
    // Lógica para eliminar (puedes llamar a tu servicio para eliminar)
    console.log('Mantenimiento eliminado:', mantenimiento);
  }


  // Puedes implementar métodos adicionales para otras operaciones CRUD según sea necesario

}