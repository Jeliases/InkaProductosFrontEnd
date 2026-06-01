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

  // Estados para el Formulario de Crear/Editar
  mostrarFormulario = false;
  esEdicion = false;
  usuarioActual: any = {};

  // Estado para el Modal de Eliminación
  usuarioAEliminar: any = null;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        if (data.length > 0) {
          console.log("💡 Espiando datos del backend (1er usuario):", data[0]);
        }
      },
      error: (err) => console.error("Error al cargar los usuarios", err)
    });
  }

  // ==========================================
  // LÓGICA DEL FORMULARIO (CREAR / EDITAR)
  // ==========================================
  abrirFormularioCrear() {
    this.esEdicion = false;
    this.usuarioActual = { nombre: '', email: '', password: '', rol: 'USUARIO', enabled: true };
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(user: any) {
    this.esEdicion = true;
    // Clonamos los datos para no afectar la tabla mientras editamos
    this.usuarioActual = { 
      ...user, 
      id: user.id || user.usuarioId,
      nombre: user.nombre || user.nombres,
      email: user.email || user.correo,
      rol: this.obtenerRol(user),
      enabled: user.enabled !== false, // Por defecto true si no viene
      password: '' // Se deja vacío para que la contraseña sea opcional al editar
    };
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioActual = {};
  }

  guardarUsuario() {
    // 1. Mapeamos el rol de texto al ID de la base de datos (1=USUARIO, 2=SUPERVISOR, 3=ADMIN)
    let rolId = 1;
    if (this.usuarioActual.rol === 'SUPERVISOR') rolId = 2;
    if (this.usuarioActual.rol === 'ADMIN') rolId = 3;

    // 2. Construimos el Payload exacto que pide UsuarioRequestDTO
    const payload: any = {
      nombre: this.usuarioActual.nombre,
      email: this.usuarioActual.email,
      enabled: this.usuarioActual.enabled,
      rolesIds: [rolId]
    };

    // 3. Solo enviamos la contraseña si el usuario escribió una
    if (this.usuarioActual.password && this.usuarioActual.password.trim() !== '') {
      payload.password = this.usuarioActual.password;
    }

    const peticion = this.esEdicion 
      ? this.usuariosService.editar(this.usuarioActual.id, payload)
      : this.usuariosService.crear(payload);

    peticion.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error("🚨 Error devuelto por el backend al guardar:", err);
        const mensajeBackend = err.error?.error || err.error?.message || "Revisa la consola para más detalles.";
        alert('Error al guardar el usuario: ' + mensajeBackend);
      }
    });
  }

  // ==========================================
  // LÓGICA DE ELIMINACIÓN (MODAL)
  // ==========================================
  confirmarEliminacion(user: any) {
    this.usuarioAEliminar = user; // Abre el modal
  }

  cancelarEliminacion() {
    this.usuarioAEliminar = null; // Cierra el modal
  }

  ejecutarEliminacion() {
    const id = this.usuarioAEliminar.id || this.usuarioAEliminar.usuarioId;
    this.usuariosService.eliminar(id).subscribe({
      next: () => {
        this.usuarioAEliminar = null; // Cierra modal
        this.cargarUsuarios();
      },
      error: (err) => {
        alert('No se pudo eliminar el usuario.');
        this.usuarioAEliminar = null;
      }
    });
  }

  // ==========================================
  // HELPER PARA EXTRAER EL ROL
  // ==========================================
  obtenerRol(user: any): string {
    let rol = 'Sin Rol';

    if (user.rol && typeof user.rol === 'string') rol = user.rol;
    else if (user.role && typeof user.role === 'string') rol = user.role;
    // Si el backend envía un arreglo de roles (Ej. Spring Boot con @ManyToMany)
    else if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      const r = user.roles[0];
      rol = typeof r === 'string' ? r : (r.nombre || r.name || r.authority || 'Sin Rol');
    } 
    // Si el backend envía los authorities directos de Spring Security
    else if (user.authorities && Array.isArray(user.authorities) && user.authorities.length > 0) {
      const auth = user.authorities[0];
      rol = typeof auth === 'string' ? auth : (auth.authority || 'Sin Rol');
    }

    // Limpiamos el prefijo "ROLE_" si Spring Boot lo incluyó
    if (rol.startsWith('ROLE_')) rol = rol.substring(5);

    return rol;
  }
}
