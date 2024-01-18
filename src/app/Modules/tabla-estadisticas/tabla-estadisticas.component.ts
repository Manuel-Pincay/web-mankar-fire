import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionReference, DocumentData, Firestore, collection  } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js';
import { catchError, take } from 'rxjs';
import ListatiposM from 'src/app/Interfaces/tiposmant.interfaces';
import { TiposMService } from 'src/app/Services/tiposM.service';
@Component({
  selector: 'app-tabla-estadisticas',
  templateUrl: './tabla-estadisticas.component.html',
  styleUrl: './tabla-estadisticas.component.css'
})
export class TablaEstadisticasComponent implements OnInit{
  // Variables para almacenar datos
  tiposMantenimientos: any[] = []; // Supongamos que tienes un array con los tipos de mantenimientos
  tiposMante: ListatiposM[] = [];
  // Variables para el gráfico
  chart: any;
  
  constructor(private firestore: Firestore,
    
    private tiposmanteService: TiposMService,
    private router: Router,
    
    ){}



  redireccionarMantenimientos() {
    this.router.navigate(['/listmts']);
  }
  
  redireccionarUsuarios() {
    this.router.navigate(['/listusers']);
  }
  
  redireccionarUnidades() {
    this.router.navigate(['/listunis']);
  }
  redireccionarRepostaje() {
    this.router.navigate(['/listreps']);
  }
  redireccionarTiposM() {
    this.router.navigate(['/listtiposmant']);
  }
  redireccionarRutas() {
    this.router.navigate(['/listrutas']);
  }
  
  
 
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
    // Obtenemos los datos de la colección "listatiposM" utilizando el método 'getTiposM':
    const tiposMantenimientos = this.tiposmanteService.getTiposM();
  
    // Escuchamos los cambios en los datos y gestionamos errores:
    tiposMantenimientos.subscribe((data: ListatiposM[]) => {
      // Extraemos los nombres de los tipos de mantenimiento:
      this.tiposMantenimientos = data.map((tipo: ListatiposM) => tipo.nombre);
  
      // Configuramos el gráfico:
      this.configurarGrafico();
    }, error => {
      console.error('Error al cargar datos desde Firebase:', error);
    });
  }
  
  // Función para configurar el gráfico
  configurarGrafico() {
    // Configuración del gráfico
    Chart.register(...registerables);
    const ctx = document.getElementById('miGrafico') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.tiposMantenimientos,
        datasets: [{
          label: 'Cantidad de Mantenimientos',
          data: this.generarDatosEjemplo(), // Puedes reemplazar esto con tus datos reales
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Esta es una función de ejemplo para generar datos de cantidad aleatorios
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

