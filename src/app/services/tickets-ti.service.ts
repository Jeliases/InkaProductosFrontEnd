import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsTiService {

  private api = 'http://localhost:8081/api/tickets';

  constructor(private http: HttpClient) {}

  // Enviar ticket desde un usuario
  enviarTicket(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  // TI: obtener pendientes
  getPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/pendientes`);
  }

  // TI: marcar como atendido
  atender(id: number): Observable<any> {
    return this.http.put(`${this.api}/${id}/atender`, {});
  }
}
