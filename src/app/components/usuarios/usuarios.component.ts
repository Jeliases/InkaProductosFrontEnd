import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  nuevo = { nombre: '', email: '', password: '' };
  rolNuevo = 'USER';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargar();
  }

  // =====================================================
  // LISTAR
  // =====================================================
  cargar() {
    this.usuariosService.listar().subscribe({
      next: res => this.usuarios = res,
      error: err => console.error("Error cargando usuarios", err)
    });
  }

  // =====================================================
  // CREAR USUARIO
  // =====================================================
  crearUsuario() {
    if (!this.nuevo.nombre || !this.nuevo.email || !this.nuevo.password) {
      alert("Completa todos los campos");
      return;
    }

    this.usuariosService.crear(this.nuevo, this.rolNuevo).subscribe({
      next: () => {
        alert("Usuario creado correctamente");
        this.cargar();
        this.nuevo = { nombre: '', email: '', password: '' };
      },
      error: err => {
        console.error(err);
        alert("Error creando usuario");
      }
    });
  }

  // =====================================================
  // CAMBIAR ROL
  // =====================================================
  cambiarRol(u: any, rol: string) {
    this.usuariosService.cambiarRol(u.usuarioId, rol).subscribe({
      next: () => {
        alert("Rol actualizado");
        this.cargar();
      },
      error: err => console.error(err)
    });
  }

  // =====================================================
  // ELIMINAR
  // =====================================================
  eliminar(u: any) {
    if (!confirm(`¿Eliminar a ${u.nombre}?`)) return;

    this.usuariosService.eliminar(u.usuarioId).subscribe({
      next: () => {
        alert("Usuario eliminado");
        this.cargar();
      },
      error: err => console.error(err)
    });
  }
}
