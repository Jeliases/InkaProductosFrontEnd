import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base de tu API de autenticación
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Procesa el login y guarda el JWT de forma automática
   */

// ... dentro de tu clase AuthService
login(email: string, password: string): Observable<any> {
  
  const body = { email: email, password: password }; 
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  return this.http.post(`${this.apiUrl}/login`, body, { headers }).pipe(
    tap((res: any) => this.guardarSesion(res))
  );
}
  /**
   * Guarda los datos del AuthResponseDTO en el LocalStorage
   */
  private guardarSesion(authData: any) {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("email", authData.email);
    localStorage.setItem("nombre", authData.nombre);
    
    // Verificamos de qué forma el backend envía los roles para evitar guardar 'undefined'
    const rolesParaGuardar = authData.roles || authData.rol || authData.role || authData.authorities || [];
    // Guardamos los roles como un String JSON
    localStorage.setItem("roles", JSON.stringify(rolesParaGuardar));
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
    
    // Validamos que no esté vacío, nulo o sea la cadena literal "undefined"
    if (!rolesData || rolesData === 'undefined' || rolesData === 'null') {
      return '';
    }

    try {
      const roles = JSON.parse(rolesData);
      
      // Si es un arreglo (lo más común)
      if (Array.isArray(roles) && roles.length > 0) {
        let rol = roles[0];
        if (rol.startsWith("ROLE_")) {
          rol = rol.substring(5);
        }
        return rol;
      }

      // Si por alguna razón vino como un String directo en vez de arreglo
      if (typeof roles === 'string') {
        let rol = roles;
        if (rol.startsWith("ROLE_")) {
          rol = rol.substring(5);
        }
        return rol;
      }
    } catch (e) {
      console.error("Error al leer los roles:", e);
    }

    return '';
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

    // El backend de Spring Security requiere el estándar "Bearer " 
    // seguido de un espacio antes del token JWT
    return `Bearer ${token}`;
  }

  /**
   * Verifica si hay un token guardado (sesión activa)
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}