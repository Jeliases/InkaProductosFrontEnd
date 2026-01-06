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

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.authService.guardarUsuario(user, this.password);
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
