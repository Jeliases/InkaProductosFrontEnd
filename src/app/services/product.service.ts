import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private movimientosUrl = 'http://localhost:8081/api/movimientos';
  private solicitudesUrl = 'http://localhost:8081/api/solicitudes';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // ADMIN — HISTORIAL DE MOVIMIENTOS

  getHistorialGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.movimientosUrl}/historial`);
  }

  // USER — SUS SOLICITUDES

  getMisSolicitudes(email: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8081/api/solicitudes/mias`, {
      params: { email }
    });
  }
  


  // USER — Crear solicitud

  crearSolicitud(payload: any): Observable<any> {
    return this.http.post(`${this.solicitudesUrl}`, payload);
  }

  getSolicitudesPendientes() {
    return this.http.get<any[]>(`http://localhost:8081/api/solicitudes/pendientes`);
  }
  
  
}
