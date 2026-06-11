import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private baseUrl = 'http://localhost:8080/api/movimientos';

  constructor(private http: HttpClient) {}

  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/historial`);
  }

}
