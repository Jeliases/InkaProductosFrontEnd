import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private url = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // LISTAR ALMACENES
  getAlmacenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/almacenes`);
  }

  // LISTAR PRODUCTOS
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/productos`);
  }

  // FILTRAR PRODUCTOS POR ALMACÉN ORIGEN
  filtrarProductos(almacenId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/productos/filtrar`, {
      params: { almacenId }
    });
  }

  // USER: ENVIAR SOLICITUD
  enviarSolicitud(payload: any): Observable<any> {
    return this.http.post(`${this.url}/solicitudes`, payload);
  }

  // ADMIN: REALIZAR MOVIMIENTO REAL
  realizarTransaccion(payload: any): Observable<any> {
    return this.http.post(`${this.url}/productos/transaccion`, payload);
  }
}
