import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:8080/api/solicitudes';

  constructor(private http: HttpClient) {}

  crearSolicitud(data: any): Observable<any> {
    // Le decimos a Angular que espere texto para que no falle al parsear JSON
    return this.http.post(this.apiUrl, data, { responseType: 'text' });
  }

  getMisSolicitudes(email: string): Observable<any[]> {
    // El backend usa el Token (Authentication) para saber quién eres, ya no enviamos el email en la URL
    return this.http.get(`${this.apiUrl}/mis`, { responseType: 'text' }).pipe(
      map(res => {
        if (!res) return []; // Si el backend no devuelve nada, devolvemos una lista vacía
        try {
          return JSON.parse(res); // Intentamos convertirlo a JSON
        } catch (e) {
          console.warn("La respuesta de Mis Solicitudes no es un JSON válido:", res);
          return [];
        }
      })
    );
  }

  getPendientes(): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/pendientes`, { responseType: 'text' }).pipe(
      map(res => {
        if (!res) return [];
        try {
          return JSON.parse(res);
        } catch (e) {
          console.warn("La respuesta de Pendientes no es un JSON válido:", res);
          return [];
        }
      })
    );
  }

  aprobarSolicitud(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/aprobar`, {}, { responseType: 'text' });
  }

  rechazarSolicitud(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/rechazar`, {}, { responseType: 'text' });
  }
}