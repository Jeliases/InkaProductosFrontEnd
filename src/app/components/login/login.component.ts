import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ingresar() {
    this.error = '';

    // Enviamos las credenciales al servicio
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // ¡Magia! No necesitamos llamar a guardarUsuario. 
        // El AuthService ya guardó el token y los roles mediante el operador 'tap'.
        
        console.log('Login exitoso, redirigiendo a inicio...');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.error = 'Credenciales incorrectas o servidor no disponible';
      }
    });
  }
}