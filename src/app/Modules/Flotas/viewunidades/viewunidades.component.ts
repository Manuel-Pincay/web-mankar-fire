import { Component } from '@angular/core';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { UnidadesService } from '../../../Services/unidades.service';

@Component({
  selector: 'app-viewunidades',
  templateUrl: './viewunidades.component.html',
  styleUrl: './viewunidades.component.css'
})
export class ViewunidadesComponent {
  unidades: Unidades[] = [];

  constructor(
    private unidadesService: UnidadesService
  ){}

  ngOnInit(): void {
    this.unidadesService.getUnidades().subscribe((data) => {
      this.unidades = data;
    });
  }

  confirmarEliminar(unidad: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que deseas eliminar este repostaje?'
    );
    if (confirmacion) {
      this.eliminarMantenimiento(unidad);
    }
  }

  eliminarMantenimiento(unidad: any): void {
    console.log('Repostaje eliminado:', unidad);
  }





}
