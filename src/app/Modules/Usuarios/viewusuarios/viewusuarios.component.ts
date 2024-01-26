import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import Usuarios from 'src/app/Interfaces/users.interfaces';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { UnidadesService } from 'src/app/Services/unidades.service';
import Unidades from 'src/app/Interfaces/unidades.interfaces';
@Component({
  selector: 'app-viewusuarios',
  templateUrl: './viewusuarios.component.html',
  styleUrl: './viewusuarios.component.css'
})
export class ViewusuariosComponent implements OnInit{

  usuarios: Usuarios[] = [];
  form: FormGroup;
  formularioEdicion: FormGroup;
  unidades$: Observable<Unidades[]> = of([]);
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  @ViewChild('cerrarModalBtn') cerrarModalBtn!: ElementRef;
  @ViewChild('cerrarModalBtn2') cerrarModalBtn2!: ElementRef;
  detalleUsuario: any;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UserService,
    private unidadesService: UnidadesService,
    private router: Router){
      this.form = this.fb.group({
        email: ['', Validators.required],
        name: ['', Validators.required],
        id: [null, Validators.required],
        estado: [true, Validators.required],
        unidad: ['', Validators.required],
        rool: ['', Validators.required],
      });
      this.formularioEdicion = this.fb.group({
        email: ['', Validators.required],
        name: ['', Validators.required],
        id: [null, Validators.required],
        estado: [true, Validators.required],
        unidad: ['', Validators.required],
        rool: ['', Validators.required],
      });
    }
  
 
  ngOnInit(): void {
    this.unidades$ = this.unidadesService.getUnidades();
    this.usuariosService.getUsuario().subscribe((data) => {
      this.usuarios = data;
    })
  }


/* EDITAR USUARIO */
editarUsario2:any;

editarUsuario(usuario: Usuarios) {
  this.editarUsario2 = usuario;
  console.log('asd' + usuario.email);
  this.formularioEdicion.patchValue({
    email: usuario?.email || '',
    name: usuario?.name || '',
    unidad: usuario?.unidad || '',
    id: usuario?.id || null,
    rool: usuario?.rool || '',
  });
}

guardarEdicion() {
  if (this.formularioEdicion.valid) {
    const usuarioData = this.formularioEdicion.value;
    const usuarioActualizado: Usuarios = {
      ...usuarioData,
      email: usuarioData.email,
      estado: true,
    };

    this.usuariosService.updateUsuario(this.editarUsario2.email, usuarioActualizado)
      .then(() => {
        this.handleSuccess('Edición exitosa', 'success', usuarioActualizado);
        this.cerrarModal();
      })
      .catch((error: any) => {
        console.error('Error al editar usuario:', error); // Imprime el error en la consola
        if (error === 'unidad_asignada') {
          this.handleUnidadExistenteError();
        } else if (error === 'cedula_existente') {
          this.handleCedulaExistenteError();
        } else {
          this.handleError('Error al editar usuario', 'error', error);
        }
      });
  } else {
    this.showIncompleteDataAlert();
  }
}


cerrarModal() {
  this.cerrarModalBtn.nativeElement.click();
}

verDetalles(usuario: any) {
  this.detalleUsuario = usuario;
}


confirmarEliminar(usuario: any): void {
  if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
    this.cambiarEstadoUsuario(usuario);
  }
}

cambiarEstadoUsuario(usuario: any): void {
  usuario.estado = false;

  this.usuariosService
    .updateUsuario2(usuario)
    .then(() =>
      this.handleSuccess('Usuario deshabilitado correctamente', 'success', usuario)
    )
    .catch((error) =>
      this.handleError('Error al deshabilitar usuario', 'error')
    );
}

/* FIN EDITAR */

private handleError(title: string, icon: SweetAlertIcon, error?: any): void {
  console.error(title, error); // Imprime el título y el error
  this.showToast(title, icon);
}


  private handleSuccess(title: string, icon: SweetAlertIcon, dato: any): void {
    console.log(title, dato);
    this.showToast(title, icon);
  }
  
  private handleCorreoExistenteError(): void {
    const title = 'Error al agregar usuario';
    const icon = 'error';
    const message = 'Ya existe un usuario con el mismo correo electrónico';
    console.error(title);
    this.showToast(title, icon, message);
  }
  
  private handleCedulaExistenteError(): void {
    const title = 'Error al agregar usuario';
    const icon = 'error';
    const message = 'Ya existe un usuario con la misma cédula';
    console.error(title);
    this.showToast(title, icon, message);
  }
  private handleUnidadExistenteError(): void {
    const title = 'Error al agregar usuario';
    const icon = 'error';
    const message = 'Ya existe un usuario con la misma unidad asignada';
    console.error(title);
    this.showToast(title, icon, message);
  }
  
  private showToast(title: string, icon: SweetAlertIcon, message?: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  
    Toast.fire({ icon, title, text: message });
  }
  

  onSubmit() {
    if (this.form.valid) {
      const usuarioData = this.form.value;
      const newusuario: Usuarios = {
        ...usuarioData,
        estado:true,
      };
      this.usuariosService
        .addUsuario(newusuario)
        .then(() => {
          this.handleSuccess('Creado correctamente', 'success', newusuario);
          this.cerrarModal2(); // Llama a la función para cerrar el modal
          this.form.reset();
        })
        .catch((error: any) => {
          if (error === 'correo_existente') {
            this.handleCorreoExistenteError();
          } else if (error === 'unidad_asignada') {
            this.handleUnidadExistenteError();
          } else if (error === 'cedula_existente') {
            this.handleCedulaExistenteError();
          }else {
            this.handleError('Error al crear usuario', 'error');
          }
        });
    } else {
      this.showIncompleteDataAlert();
    }
  }

  cerrarModal2() {
    this.cerrarModalBtn2.nativeElement.click();
    this.form.reset();
  }
  
  private showIncompleteDataAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos.',
    });
  }

}
