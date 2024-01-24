import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionReference, DocumentData, Firestore, collection  } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js';
import { catchError, take } from 'rxjs';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';
import Mantenimientos from 'src/app/Interfaces/mantenimientos.interfaces';
import { MantenimientosService } from 'src/app/Services/mantenimientos.service';
@Component({
  selector: 'app-tabla-estadisticas',
  templateUrl: './tabla-estadisticas.component.html',
  styleUrl: './tabla-estadisticas.component.css'
})
export class TablaEstadisticasComponent implements OnInit{
  
  tiposMantenimientos: any[] = [];
  tiposMante: ListatiposM[] = [];
  chart: any;
  
  constructor(private firestore: Firestore,
    
    private tiposmanteService: TiposMService,
    private router: Router,
    
    private mantenimientosService: MantenimientosService,
    ){}


  ngOnInit(): void {
    this.cargarDatosFirebase();
  }
  
  cargarDatosFirebase() {
    const mantenimientos = this.mantenimientosService.getMantenimientos();
  
    mantenimientos.subscribe(
      (data: Mantenimientos[]) => {
        const contadorTipos: { [tipo: string]: number } = {};
        data.forEach(mantenimiento => {
          const tipo = mantenimiento.descripcion || 'Sin Tipo';
          contadorTipos[tipo] = (contadorTipos[tipo] || 0) + 1;
        });
        const tiposMantenimientos = Object.keys(contadorTipos);
        const cantidades = tiposMantenimientos.map(tipo => contadorTipos[tipo]);
        this.configurarGrafico(tiposMantenimientos, cantidades);
      },
      error => {
        console.error('Error al cargar datos desde Firebase:', error);
      }
    );
  }
  
  configurarGrafico(tiposMantenimientos: string[], cantidades: number[]) {
    Chart.register(...registerables);
    const ctx = document.getElementById('miGrafico') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: tiposMantenimientos,
        datasets: [
          {
            label: 'Cantidad de Mantenimientos',
            data: cantidades,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
        },
      },
    });
  }
  
  
  generarDatosEjemplo(): number[] {
    return Array.from({ length: this.tiposMantenimientos.length }, () => Math.floor(Math.random() * 10) + 1);
  }

}

function valueChanges(tiposMRef: CollectionReference<DocumentData, DocumentData>) {
  throw new Error('Function not implemented.');
}

