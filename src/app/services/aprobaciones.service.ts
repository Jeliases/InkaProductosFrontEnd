import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AprobacionesService {

  private url = 'http://localhost:8081/api/aprobaciones';

  constructor(private http: HttpClient) {}

  getPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/pendientes`);
  }

  aprobar(id: number): Observable<any> {
    return this.http.put(`${this.url}/aprobar/${id}`, {});
  }
  
  rechazar(id: number): Observable<any> {
    return this.http.put(`${this.url}/rechazar/${id}`, {});
  }
  
}
