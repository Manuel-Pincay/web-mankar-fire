import { Component } from '@angular/core';
import Repostajes from 'src/app/Interfaces/repostajes.interfaces';
import { RepostajesService } from 'src/app/Services/repostajes.service';

@Component({
  selector: 'app-viewrepostaje',
  templateUrl: './viewrepostaje.component.html',
  styleUrl: './viewrepostaje.component.css'
})
export class ViewrepostajeComponent {
  repostajes: Repostajes[] = [];


  constructor(
 
    private repostajesService: RepostajesService
  ) {}

  ngOnInit(): void {
 
    this.repostajesService.getRepostajes().subscribe((data) => {
      this.repostajes = data;
      
    });
  }

  confirmarEliminar(repostaje: any): void {
    const confirmacion = window.confirm(
      '¿Seguro que deseas eliminar este repostaje?'
    );
    if (confirmacion) {
      // Lógica de eliminación (puedes llamar a tu servicio para eliminar)
      this.eliminarMantenimiento(repostaje);
    }
  }

  eliminarMantenimiento(repostaje: any): void {
    // Lógica para eliminar (puedes llamar a tu servicio para eliminar)
    console.log('Repostaje eliminado:', repostaje);
  }






}
