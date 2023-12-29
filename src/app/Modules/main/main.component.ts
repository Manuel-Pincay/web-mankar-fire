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
    this.router.navigate(['/mantenimientos']);
  }
  
  redireccionarUsuarios() {
    this.router.navigate(['/verusuarios']);
  }
  
  redireccionarUnidades() {
    this.router.navigate(['/verunidades']);
  }
  redireccionarRepoostaje() {
    this.router.navigate(['/verrepostajes']);
  }
  

}