import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base de tu API de autenticación
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Procesa el login y guarda el JWT de forma automática
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        // Almacenamos el Token y los datos del usuario de forma segura
        this.guardarSesion(res);
      })
    );
  }

  /**
   * Guarda los datos del AuthResponseDTO en el LocalStorage
   */
  private guardarSesion(authData: any) {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("email", authData.email);
    localStorage.setItem("nombre", authData.nombre);
    // Guardamos los roles como un String JSON
    localStorage.setItem("roles", JSON.stringify(authData.roles));
  }

  /**
   * Limpia el LocalStorage al cerrar sesión
   */
  cerrarSesion() {
    localStorage.clear();
  }

  /**
   * Retorna el rol principal del usuario sin el prefijo "ROLE_"
   */
  getRol(): string {
    const rolesData = localStorage.getItem("roles");
    if (!rolesData) return '';

    const roles: string[] = JSON.parse(rolesData);
    if (roles.length === 0) return '';

    // Tomamos el primer rol (ej: "ROLE_ADMIN")
    let rol = roles[0];

    // Limpiamos el prefijo para que tu lógica de Angular siga funcionando (ADMIN, USER, TI)
    if (rol.startsWith("ROLE_")) {
      rol = rol.substring(5);
    }

    return rol;
  }

  /**
   * Retorna el email del usuario logueado
   */
  getEmail(): string {
    return localStorage.getItem("email") || '';
  }

  /**
   * Retorna el nombre del usuario para mostrar en el Navbar
   */
  getNombre(): string {
    return localStorage.getItem("nombre") || 'Usuario';
  }

  /**
   * Genera la cabecera de autorización Bearer para el Interceptor
   */
  getAuthHeader(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Ahora enviamos el Token JWT, no la contraseña
    return `Bearer ${token}`;
  }

  /**
   * Verifica si hay un token guardado (sesión activa)
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}