import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/api/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password });
  }

  guardarUsuario(usuario: any, password: string) {
    usuario.password = password;
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  obtenerUsuario() {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  }

  cerrarSesion() {
    localStorage.removeItem("usuario");
  }


  //  FIX CRÍTICO — getRol correcto

  getRol(): string {
    const usuario = this.obtenerUsuario();
    if (!usuario) return '';

    // Intentar todas las formas posibles
    let rol =
      usuario.rol ||
      usuario.role ||
      usuario.roles?.[0]?.nombre ||
      usuario.authorities?.[0]?.authority;

    if (!rol) return '';

    // Si viene como ROLE_ADMIN → ADMIN
    if (rol.startsWith("ROLE_")) {
      rol = rol.substring(5);
    }

    return rol;
  }

  getEmail(): string {
    const usuario = this.obtenerUsuario();
    return usuario ? usuario.email : '';
  }

  getAuthHeader() {
    const usuario = this.obtenerUsuario();
    if (!usuario) return null;

    const basic = btoa(`${usuario.email}:${usuario.password}`);
    return `Basic ${basic}`;
  }
}
