import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { MantenimientosService } from 'src/app/Services/mantenimientos.service';
import { TiposMService } from 'src/app/Services/tiposM.service';
import { Observable, of } from 'rxjs';
import { UnidadesService } from 'src/app/Services/unidades.service';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import Mantenimientos from 'src/app/Interfaces/mantenimientos.interfaces';

@Component({
  selector: 'app-tabla-1',
  templateUrl: './tabla-1.component.html',
  styleUrls: ['./tabla-1.component.css'],
})
/* 
export class Tabla1Component implements OnInit {
  unidades$: Observable<Unidades[]> = of([]);
  tiposM$: Observable<ListatiposM[]> = of([]);
  selectedUnidad: string = '';
  selectedTipoMantenimiento: string = '';
  chart: any;

  constructor(
    private unidadesService: UnidadesService,
    private tiposMService: TiposMService,
    private mantenimientosService: MantenimientosService
  ) {}

  ngOnInit(): void {
    this.unidades$ = this.unidadesService.getUnidades();
    this.tiposM$ = this.tiposMService.getTiposM();
    this.actualizarDatos(); // Agregar esta línea si deseas cargar datos al inicio
  }

  actualizarDatos() {
    if (this.selectedUnidad && this.selectedTipoMantenimiento) {
      this.cargarDatosFirebase();
      console.log('Unidad seleccionada:', this.selectedUnidad);
      console.log('Unidad seleccionada:', this.selectedTipoMantenimiento);
    }
  }
  
  formatDate(date: Date, p0: string): string {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return '';
  }

  cargarDatosFirebase() {
    this.mantenimientosService
      .getMantenimientosPorUnidad(this.selectedUnidad)
      .subscribe(
        (data: Mantenimientos[]) => {
          const conteoPorMes: { [mes: number]: number } = {};
          data.reduce((acumulado: { [mes: number]: number }, mantenimiento: Mantenimientos) => {
            const mes = Number(mantenimiento.fecha);
            acumulado[mes] = (acumulado[mes] || 0) + 1;
            return acumulado;
          }, {});
          const tipos = Object.keys(conteoPorMes);
          const cantidades = Object.values(conteoPorMes);
          this.configurarGrafico(tipos, cantidades);
  
          console.log('Se encontraron', data.length, 'mantenimientos.');
  
 
        },
        (error: any) => {
          console.error('Error al cargar datos desde Firebase:', error);
        },
      );
  }
  
  configurarGrafico(meses: string[], cantidades: number[]) {
    Chart.register(...registerables);
    const ctx = document.getElementById('miGrafico') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar', // Puedes cambiar el tipo de gráfico según tus preferencias
      data: {
        labels: meses,
        datasets: [
          {
            label: `Cantidad de Mantenimientos (${this.selectedTipoMantenimiento})`,
            data: cantidades,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  } */
export class Tabla1Component implements OnInit {
  unidades$: Observable<Unidades[]> = of([]);
  tiposM$: Observable<ListatiposM[]> = of([]);
  selectedUnidad: string = '';
  selectedTipoMantenimiento: string = '';
  selectedYear: number =1;
  chart: any;
  years: number[] = [];

  constructor(
    private unidadesService: UnidadesService,
    private tiposMService: TiposMService,
    private mantenimientosService: MantenimientosService
  ) {}

  ngOnInit(): void {
    this.unidades$ = this.unidadesService.getUnidades();
    this.tiposM$ = this.tiposMService.getTiposM();

    // Inicializar años disponibles (puedes ajustar este rango según tus necesidades)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 10; year--) {
      this.years.push(year);
    }

    this.actualizarDatos();
  }

  actualizarDatos() {
    if (this.selectedUnidad && this.selectedTipoMantenimiento && this.selectedYear) {
      this.cargarDatosFirebase();
    }
  }
  
  buscar() {
    this.cargarDatosFirebase();
  }
  /* 
  cargarDatosFirebase() {
    this.mantenimientosService
      .getMantenimientosPorUnidadYTipo(this.selectedUnidad, this.selectedTipoMantenimiento)
      .subscribe(
        (data: any[]) => {
          console.log('Datos de mantenimientos obtenidos:', data);
  
          const conteoPorMes: { [mes: number]: number } = {};
  
          // Inicializa el conteo por mes
          for (let i = 1; i <= 12; i++) {
            conteoPorMes[i] = 0;
          }
  
          data.forEach(mantenimiento => {
            const fechaTimestamp = mantenimiento.fecha.seconds * 1000; // Convertir a milisegundos
            const fecha = new Date(fechaTimestamp);
            const mes = fecha.getMonth() + 1; // Meses en JavaScript van de 0 a 11
            conteoPorMes[mes]++; // Incrementa la cantidad de mantenimientos para este mes
          });
  
          // Obtén los nombres de los meses en orden
          const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ];
  
          // Prepara los datos para el gráfico
          const cantidades = meses.map((mes, index) => conteoPorMes[index + 1] || 0);
  
          // Configura el gráfico con los datos actualizados
          this.configurarGrafico(meses, cantidades);
        },
        (error: any) => {
          console.error('Error al cargar datos desde Firebase:', error);
        },
      );
  } */
  
  
  cargarDatosFirebase() {
  /*   this.mantenimientosService
      .getMantenimientosPorUnidadTipoYYear(this.selectedUnidad, this.selectedTipoMantenimiento, this.selectedYear)
      .subscribe(
        (data: any[]) => {
          console.log('Datos de mantenimientos obtenidos:', data);

          const conteoPorMes: { [mes: number]: number } = {};

          // Inicializa el conteo por mes
          for (let i = 1; i <= 12; i++) {
            conteoPorMes[i] = 0;
          }

          data.forEach(mantenimiento => {
            const fechaTimestamp = mantenimiento.fecha.seconds * 1000;
            const fecha = new Date(fechaTimestamp);
            const mes = fecha.getMonth() + 1;
            conteoPorMes[mes]++;
          });

          const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ];

          const cantidades = meses.map((mes, index) => conteoPorMes[index + 1] || 0);

          this.configurarGrafico(meses, cantidades);
        },
        (error: any) => {
          console.error('Error al cargar datos desde Firebase:', error);
        },
      ); */
  }
  configurarGrafico(meses: string[], cantidades: number[]) {
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico existente si hay uno
    }

    Chart.register(...registerables);
    const ctx = document.getElementById('miGrafico') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: `Cantidad de Mantenimientos (${this.selectedTipoMantenimiento})`,
            data: cantidades,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
