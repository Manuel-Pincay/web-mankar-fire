import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewrutas',
  templateUrl: './viewrutas.component.html',
  styleUrl: './viewrutas.component.css'
})
export class ViewrutasComponent implements OnInit{



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
