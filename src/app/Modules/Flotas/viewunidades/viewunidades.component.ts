import { Component } from '@angular/core';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
import { UnidadesService } from '../../../Services/unidades.service';
import { Chart } from 'chart.js';

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

    if (window.innerWidth < 768) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.add('collapsed');
      }
    }
    // end: Sidebar

    // start: Charts
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    const salesChart = new Chart('sales-chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: '#6610f2',
          data: [5, 10, 5, 2, 20, 30, 45],
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    const visitorsChart = new Chart('visitors-chart', {
      type: 'doughnut',
      data: {
        labels: ['Children', 'Teenager', 'Parent'],
        datasets: [{
          backgroundColor: ['#6610f2', '#198754', '#ffc107'],
          data: [40, 60, 80],
        }]
      }
    });
    // end: Charts
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


/* 
  ngOnInit() {
    // start: Sidebar
    const sidebarDropdownMenus = document.querySelectorAll('.sidebar-dropdown-menu');
    sidebarDropdownMenus.forEach(menu => menu.style.display = 'none');

    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a');
    sidebarMenuItems.forEach(item => item.addEventListener('click', this.sidebarItemClick.bind(this)));

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.sidebarToggleClick.bind(this));
    }

    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', this.sidebarOverlayClick.bind(this));
    }

    if (window.innerWidth < 768) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.add('collapsed');
      }
    }
    // end: Sidebar

    // start: Charts
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    const salesChart = new Chart('sales-chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: '#6610f2',
          data: [5, 10, 5, 2, 20, 30, 45],
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    const visitorsChart = new Chart('visitors-chart', {
      type: 'doughnut',
      data: {
        labels: ['Children', 'Teenager', 'Parent'],
        datasets: [{
          backgroundColor: ['#6610f2', '#198754', '#ffc107'],
          data: [40, 60, 80],
        }]
      }
    });
    // end: Charts
  } */

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
