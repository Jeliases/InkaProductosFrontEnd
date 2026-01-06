import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  usuarioNombre: string = 'Invitado';
  email: string = '';
  rol: string = '';

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.obtenerUsuario(); // <--- se obtiene desde localStorage

    if (user) {
      this.email = user.email;
      this.rol = (user.rol || '').replace('ROLE_', '');

      // Nombre visible en el navbar
      if (user.username) {
        this.usuarioNombre = user.username;
      } else if (user.nombre) {
        this.usuarioNombre = user.nombre;
      } else {
        // Si no hay nombre, mostramos el correo
        this.usuarioNombre = user.email;
      }
    }
  }

  // Lógica de roles
  esAdmin() { return this.rol === 'ADMIN'; }
  esUser()  { return this.rol === 'USER'; }
  esTI()    { return this.rol === 'TI'; }

  // Logout CORREGIDO
  onLogout() {
    // Tu AuthService usa "usuario" como clave en el localStorage
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
