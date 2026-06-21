  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Ticket } from '../models/ticket.model';

  @Injectable({
    providedIn: 'root'
  })
  export class SoporteService {
    // Apuntamos al Gateway, él se encarga de redirigir al microservicio inka-soporte
    private apiUrl = 'http://localhost:8080/api/soporte/mensajes';

    constructor(private http: HttpClient) { }

    // 1. Supervisor crea ticket
    crearTicket(ticket: Ticket): Observable<any> {
      return this.http.post(this.apiUrl, ticket);
    }

    // 2. Admin ve todos los tickets
    obtenerTodos(): Observable<Ticket[]> {
      return this.http.get<Ticket[]>(this.apiUrl);
    }

    // 3. Supervisor ve sus propios tickets
    obtenerMisTickets(email: string): Observable<Ticket[]> {
      return this.http.get<Ticket[]>(`${this.apiUrl}/mis-tickets?email=${email}`);
    }

    // 4. Admin cambia el estado
    actualizarEstado(id: number, estado: string): Observable<any> {
      return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
    }
  }