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
    
    // ========================================================================================== // 
    // BARRA LATERAL================================================= // 
    // ========================================================================================== // 
    const sidebarDropdownMenus = document.querySelectorAll('.sidebar-dropdown-menu');
    sidebarDropdownMenus.forEach(menu => (menu as HTMLElement).style.display = 'none');
    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a');
    sidebarMenuItems.forEach(item => item.addEventListener('click', (event) => this.sidebarItemClick(event)));
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.sidebarToggleClick.bind(this));
    }
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', this.sidebarOverlayClick.bind(this));
    }
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('collapsed');
    }
    if (window.innerWidth < 768) { }
    // ========================================================================================== // 
    // ========================================================================================== // 

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


sidebarItemClick(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const parent = target.parentElement;
    if (parent && !parent.classList.contains('focused')) {
      this.hideOtherMenus(parent.parentElement);
    }
    const next = target.nextElementSibling as HTMLElement;
    if (next) {
      next.style.display = (next.style.display === 'none') ? 'block' : 'none';
    }
    if (parent) {
      parent.classList.toggle('focused');
    }
  }
  sidebarToggleClick() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      sidebar.addEventListener('mouseleave', this.sidebarMouseLeave.bind(this));
    }
  }
  sidebarOverlayClick() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('collapsed');
    }

    this.hideAllMenus();
  }
  sidebarMouseLeave() {
    this.hideAllMenus();
  }
  hideOtherMenus(element: Element | null) {
    if (element) {
      const menus = element.querySelectorAll('.sidebar-dropdown-menu');
      const hasDropdowns = element.querySelectorAll('.has-dropdown.focused');

      menus.forEach(menu => (menu as HTMLElement).style.display = 'none');
      hasDropdowns.forEach(item => item.classList.remove('focused'));
    }
  }
  hideAllMenus() {
    const menus = document.querySelectorAll('.sidebar-dropdown-menu');
    const hasDropdowns = document.querySelectorAll('.has-dropdown.focused');
    menus.forEach(menu => (menu as HTMLElement).style.display = 'none');
    hasDropdowns.forEach(item => item.classList.remove('focused'));
  }

}
function valueChanges(tiposMRef: CollectionReference<DocumentData, DocumentData>) {
  throw new Error('Function not implemented.');
}

