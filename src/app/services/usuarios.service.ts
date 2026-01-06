import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = 'http://localhost:8081/api/usuarios';

  constructor(private http: HttpClient) {}

  // LISTAR
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // CREAR
  crear(usuario: any, rol: string): Observable<any> {
    return this.http.post(`${this.url}/${rol}`, usuario);
  }
  

  // EDITAR
  editar(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, usuario);
  }

  // CAMBIAR ROL
  cambiarRol(id: number, rol: string): Observable<any> {
    return this.http.put(`${this.url}/${id}/rol/${rol}`, {});
  }

  // ELIMINAR
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
