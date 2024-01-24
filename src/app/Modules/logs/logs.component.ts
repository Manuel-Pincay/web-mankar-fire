import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { LogService } from 'src/app/Services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;

  logs: any[] = [];
  detalleLog: any; 
  constructor(private firestore: Firestore, 
    private logService: LogService ) {}

    ngOnInit(): void {
      this.loadLogs();
    }
    loadLogs() {
      this.logService.getLogs().subscribe((logs) => {
        this.logs = logs;
      });
    }

    verDetallesLog(log: any) {
      // Asignar los detalles del log para mostrar en el modal
      this.detalleLog = log;
  
      // Abrir el modal
      const modal = document.getElementById('verDetallesLogModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
      }
    }
  
    cerrarModal() {
      this.cerrarModalBtn.nativeElement.click();
    }

}

 