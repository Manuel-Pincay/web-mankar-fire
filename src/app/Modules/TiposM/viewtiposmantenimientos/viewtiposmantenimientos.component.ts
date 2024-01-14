import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewtiposmantenimientos',
  templateUrl: './viewtiposmantenimientos.component.html',
  styleUrl: './viewtiposmantenimientos.component.css'
})
export class ViewtiposmantenimientosComponent implements OnInit{



  constructor(
    private router: Router){}



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
      
  }

}
