import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperacionpass',
  templateUrl: './recuperacionpass.component.html',
  styleUrl: './recuperacionpass.component.css'
})
export class RecuperacionpassComponent implements OnInit {

  formRestablecer: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    this.formRestablecer = new FormGroup({
      email: new FormControl(), 
    });
  }
  ngOnInit(): void {}

  onSubmit() {
    // Verifica si el formulario es válido antes de enviar
    if (this.formRestablecer.valid) {
      const email = this.formRestablecer.value.email;

      // Llama a la función del servicio para enviar el correo
      this.userService.restablecerUsuario(email)
        .then(() => {
          mostrarAlertaRestablecimiento();      
          this.router.navigate(['/login']);  })
        .catch((error) => {
          console.log(error);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: "Error en restablecimiento"
          });
        });
    }
  }




}




// Función para mostrar la alerta de restablecimiento de contraseña
function mostrarAlertaRestablecimiento() {
  Swal.fire({
    title: 'Restablecer Contraseña',
    html: 'Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones proporcionadas en el correo electrónico para restablecer tu contraseña.',
    icon: 'info',
    confirmButtonText: 'OK',
  });
}