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

  usuario: any;
  rol: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.auth.obtenerUsuario();
    this.rol = (this.usuario?.rol || '').replace('ROLE_', ''); // ADMIN, USER, TI
  }

  esAdmin() { return this.rol === 'ADMIN'; }
  esUser() { return this.rol === 'USER'; }
  esTI()   { return this.rol === 'TI'; }
}
