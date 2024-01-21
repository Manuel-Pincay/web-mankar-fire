import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit  { 

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

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

  
  

}