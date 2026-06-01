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
    // 1. Usamos los nuevos métodos limpios del AuthService
    this.usuarioNombre = this.auth.getNombre();
    this.email = this.auth.getEmail();
    this.rol = this.auth.getRol(); // Ya viene sin "ROLE_" gracias a tu AuthService

    console.log("🟢 Rol detectado en Navbar:", this.rol); // <-- Útil para saber qué rol tienes
  }

  // Lógica de roles simplificada para tus directivas *ngIf del HTML
  esAdmin() { return this.rol === 'SUPERVISOR'; }
  esUser()  { return this.rol === 'USUARIO'; }
  esTI()    { return this.rol === 'ADMIN'; } 

  /**
   * Logout Profesional
   * Ahora delegamos la limpieza al servicio para que borre Token, Roles y Nombre de un solo golpe.
   */
  onLogout() {
    this.auth.cerrarSesion(); // Esto hace el localStorage.clear() que definimos
    this.router.navigate(['/login']);
  }
}