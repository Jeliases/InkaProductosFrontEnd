import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  // Usamos variables específicas en lugar de un objeto 'any'
  nombreUsuario: string = '';
  rol: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // 1. Obtenemos el nombre directamente para mostrar en la bienvenida
    this.nombreUsuario = this.auth.getNombre();

    // 2. Obtenemos el rol ya procesado (sin el prefijo ROLE_)
    this.rol = this.auth.getRol();
  }

  // Lógica de roles corregida para que coincida exactamente con PostgreSQL
  esAdmin(): boolean { 
    return this.rol === 'ADMIN'; 
  }
  
  esSupervisor(): boolean { 
    return this.rol === 'SUPERVISOR'; 
  }
  
  esUser(): boolean { 
    return this.rol === 'USUARIO'; 
  }
  
  esTI(): boolean { 
    return this.rol === 'ADMIN'; 
  }
}