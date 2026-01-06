import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  private authHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: token } : {});
  }

  // LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // PRODUCTOS
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/productos`);
  }

  filtrar(categoriaId?: number, almacenId?: number): Observable<any[]> {
    const params: any = {};
    if (categoriaId) params.categoriaId = categoriaId;
    if (almacenId) params.almacenId = almacenId;

    return this.http.get<any[]>(`${this.baseUrl}/api/productos/filtrar`, { params });
  }

  // TRANSACCIÓN - SOLO ADMIN
  procesarTransaccion(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/productos/transaccion`, data, {
      headers: this.authHeader()
    });
  }

  // MIS SOLICITUDES (USER)
  getMisSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/productos/transaccion/mias`, {
      headers: this.authHeader()
    });
  }

  // HISTORIAL
  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/productos/transaccion/historial`, {
      headers: this.authHeader()
    });
  }

  // APROBACIONES (ADMIN)
  getPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/aprobaciones/pendientes`, {
      headers: this.authHeader()
    });
  }

  aprobarSolicitud(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/aprobaciones/${id}/aprobar`, {}, {
      headers: this.authHeader()
    });
  }

  rechazarSolicitud(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/aprobaciones/${id}/rechazar`, {}, {
      headers: this.authHeader()
    });
  }
}
