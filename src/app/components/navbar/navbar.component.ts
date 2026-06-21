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
    this.usuarioNombre = this.auth.getNombre();
    this.email = this.auth.getEmail();
    this.rol = this.auth.getRol(); 

    console.log(" Rol detectado en Navbar:", this.rol); 
  }

  // Lógica de roles corregida. Apuntamos a la variable "this.rol" que ya cargamos.
  esAdmin()      { return this.rol === 'ADMIN'; }
  esSupervisor() { return this.rol === 'SUPERVISOR'; }
  esUser()       { return this.rol === 'USUARIO'; }
  esTI()         { return this.rol === 'ADMIN'; } // Si TI es lo mismo que Admin en tu BD

  onLogout() {
    this.auth.cerrarSesion(); 
    this.router.navigate(['/login']);
  }
}